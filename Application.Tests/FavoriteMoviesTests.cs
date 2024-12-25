using Application.Services.Favorites;
using Application.Core;
using Domain.Entities;
using Moq;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq;
using Application.Interfaces;
using Application.Services.Fvorites;
using AutoMapper;

namespace Application.Tests.Favorites;

public class FavoriteMoviesTests
{
    private readonly Mock<IUserAccessor> _mockUserAccessor;

    public FavoriteMoviesTests()
    {
        _mockUserAccessor = new Mock<IUserAccessor>();
    }

    [Fact]
    public async Task List_ShouldReturnAllFavorites_ForLoggedInUser()
    {
        // Arrange
        var userId = "test-user-id";

        // Configurar mock do IUserAccessor
        _mockUserAccessor.Setup(u => u.GetUsername()).Returns("testuser");

        // Configurar o banco de dados em memória com nome único
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        using var context = new DataContext(options);

        // Adicionar o usuário ao banco de dados
        var user = new AppUser
        {
            Id = userId,
            UserName = "testuser",
            DisplayName = "Test User",
            Email = "testuser@example.com"
        };

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        // Adicionar filmes favoritos ao banco de dados
        var favoriteMovies = new List<FavoriteMovie>
        {
            new FavoriteMovie { Id = Guid.NewGuid(), ImdbId = "tt1234567", Title = "Movie 1", Year = "2020", UserId = userId },
            new FavoriteMovie { Id = Guid.NewGuid(), ImdbId = "tt2345678", Title = "Movie 2", Year = "2021", UserId = userId }
        };

        await context.FavoriteMovies.AddRangeAsync(favoriteMovies);
        await context.SaveChangesAsync();

        // Criar o handler
        var handler = new List.Handler(context, _mockUserAccessor.Object);

        // Configurar parâmetros de paginação
        var pagingParams = new PagingParams
        {
            PageNumber = 1,
            PageSize = 10
        };

        var query = new List.Query { PagingParams = pagingParams };

        // Act
        var result = await handler.Handle(query, default);

        // Assert
        Assert.NotNull(result); // Certifica-se de que o resultado não é nulo
        Assert.True(result.IsSuccess); // A operação deve ser bem-sucedida
        Assert.NotNull(result.Value); // Certifica-se de que o resultado contém valores
        Assert.Equal(2, result.Value.Count); // Deve retornar os 2 favoritos do usuário logado

        // Verificar se os filmes retornados pertencem ao usuário logado
        Assert.All(result.Value, movie => Assert.Contains(movie.ImdbId, favoriteMovies.Select(f => f.ImdbId)));
    }



    [Fact]
    public async Task Create_ShouldAddFavoriteMovie_ForLoggedInUser()
    {
        // Configurar o banco de dados em memória
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Nome único para cada teste
            .Options;

        using var context = new DataContext(options);

        // Mock do IUserAccessor
        var mockUserAccessor = new Mock<IUserAccessor>();
        mockUserAccessor.Setup(u => u.GetUsername()).Returns("testuser");

        // Adicionar o usuário ao banco de dados
        var user = new AppUser
        {
            Id = "test-user-id",
            UserName = "testuser",
            DisplayName = "Test User",
            Email = "testuser@example.com"
        };

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        // Mock do IMapper
        var mockMapper = new Mock<IMapper>();
        mockMapper.Setup(m => m.Map<FavoriteMovie>(It.IsAny<AddFavoriteDto>()))
                .Returns((AddFavoriteDto dto) => new FavoriteMovie
                {
                    ImdbId = dto.ImdbId,
                    Title = dto.Title,
                    Year = dto.Year,
                    Poster = dto.Poster,
                    AddedAt = DateTime.UtcNow,
                    UserId = user.Id // Associando ao usuário logado
                });

        // Dados para o teste
        var addFavoriteDto = new AddFavoriteDto
        {
            ImdbId = "tt1234567",
            Title = "Test Movie",
            Year = "2022",
            Poster = "http://example.com/poster.jpg"
        };

        // Criar o handler com os mocks configurados
        var handler = new Create.Handler(context, mockUserAccessor.Object);

        // Act
        var result = await handler.Handle(new Create.Command { FavoriteMovie = addFavoriteDto }, default);

        // Assert
        Assert.True(result.IsSuccess); // O handler deve retornar sucesso

        // Verificar se o filme foi adicionado ao banco de dados
        var favoriteMovie = await context.FavoriteMovies.FirstOrDefaultAsync(f => f.ImdbId == "tt1234567");
        Assert.NotNull(favoriteMovie);
        Assert.Equal("Test Movie", favoriteMovie.Title);
        Assert.Equal(user.Id, favoriteMovie.UserId); // Garantir que o filme pertence ao usuário logado
    }



    [Fact]
    public async Task Delete_ShouldRemoveFavoriteMovie_IfBelongsToLoggedInUser()
    {
        // Arrange
        var userId = "test-user-id";

        // Configurar mock do IUserAccessor
        var mockUserAccessor = new Mock<IUserAccessor>();
        mockUserAccessor.Setup(u => u.GetUsername()).Returns("testuser");

        // Configurar o banco de dados em memória
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Nome único para cada teste
            .Options;

        using var context = new DataContext(options);

        // Adicionar o usuário ao banco de dados
        var user = new AppUser
        {
            Id = userId,
            UserName = "testuser",
            DisplayName = "Test User",
            Email = "testuser@example.com"
        };

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        // Adicionar o filme favorito ao banco de dados
        var favoriteMovie = new FavoriteMovie
        {
            Id = Guid.NewGuid(),
            ImdbId = "tt1234567",
            Title = "Movie 1",
            Year = "2020",
            UserId = userId // Vinculado ao usuário logado
        };

        await context.FavoriteMovies.AddAsync(favoriteMovie);
        await context.SaveChangesAsync();

        // Criar o handler com o mock configurado
        var handler = new Delete.Handler(context, mockUserAccessor.Object);

        // Act
        var result = await handler.Handle(new Delete.Command { Id = favoriteMovie.Id }, default);

        // Assert
        Assert.True(result.IsSuccess); // A exclusão deve ser bem-sucedida
        Assert.Null(await context.FavoriteMovies.FindAsync(favoriteMovie.Id)); // O filme deve ser removido
    }



    [Fact]
    public async Task Delete_ShouldFail_IfMovieDoesNotBelongToLoggedInUser()
    {
        // Arrange
        var otherUserId = "other-user-id";

        // Mock do IUserAccessor para retornar o usuário logado
        var mockUserAccessor = new Mock<IUserAccessor>();
        mockUserAccessor.Setup(u => u.GetUsername()).Returns("testuser");

        // Banco de dados em memória com nome único
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Nome único para cada teste
            .Options;

        await using var context = new DataContext(options);

        // Adicionar o usuário ao banco de dados
        var user = new AppUser
        {
            Id = "test-user-id",
            UserName = "testuser",
            DisplayName = "Test User",
            Email = "testuser@example.com"
        };

        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        // Filme favorito que pertence a outro usuário
        var favoriteMovie = new FavoriteMovie
        {
            Id = Guid.NewGuid(),
            ImdbId = "tt1234567",
            Title = "Movie 1",
            Year = "2020",
            UserId = otherUserId // Associado a outro usuário
        };

        await context.FavoriteMovies.AddAsync(favoriteMovie);
        await context.SaveChangesAsync();

        // Criação do handler com os mocks
        var handler = new Delete.Handler(context, mockUserAccessor.Object);

        // Act
        var result = await handler.Handle(new Delete.Command { Id = favoriteMovie.Id }, default);

        // Assert
        Assert.False(result.IsSuccess); // Deve falhar
        Assert.Equal("Favorito não encontrado ou não pertence ao usuário logado.", result.Error);
    }
}
