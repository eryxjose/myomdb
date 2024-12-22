using Bogus;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public static class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            
            if (await userManager.Users.AnyAsync()) return;

            // Gerador para usuários
            var userFaker = new Faker<AppUser>()
                .RuleFor(u => u.UserName, f => f.Internet.UserName())
                .RuleFor(u => u.Email, f => f.Internet.Email())
                .RuleFor(u => u.DisplayName, f => f.Name.FullName())
                .RuleFor(u => u.RegistrationDate, f => f.Date.Past(2));

            var users = userFaker.Generate(10);

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Password123!");
            }

            // Salvando os usuários no banco
            await context.SaveChangesAsync();

            // Recuperando os usuários salvos para vinculação
            var savedUsers = await context.Users.ToListAsync();

            // Gerador para filmes favoritos
            var favoriteMovieFaker = new Faker<FavoriteMovie>()
                .RuleFor(f => f.ImdbId, f => f.Random.AlphaNumeric(10))
                .RuleFor(f => f.Title, f => f.Lorem.Sentence(3))
                .RuleFor(f => f.Year, f => f.Date.Past(20).Year.ToString())
                .RuleFor(f => f.Poster, f => f.Image.PicsumUrl())
                .RuleFor(f => f.AddedAt, f => f.Date.Recent(30));

            var favoriteMovies = favoriteMovieFaker.Generate(50);

            // Vinculando filmes favoritos a usuários
            foreach (var movie in favoriteMovies)
            {
                var randomUser = savedUsers[new Random().Next(savedUsers.Count)];
                movie.UserId = randomUser.Id;
                context.FavoriteMovies.Add(movie);
            }

            // Salvando os dados gerados no banco
            await context.SaveChangesAsync();
        }
    }
}
