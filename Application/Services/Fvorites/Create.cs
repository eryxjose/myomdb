using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services.Fvorites;

public class Create
{
    public class Command : IRequest<Result<Unit>>
    {
        public AddFavoriteDto FavoriteMovie { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Obter o usuário logado 
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername(), cancellationToken);

            if (user == null)
                return Result<Unit>.Failure("Usuário não encontrado.");
                
            var favoriteMovie = new FavoriteMovie
            {
                UserId = user.Id,
                Title = request.FavoriteMovie.Title,
                Year = request.FavoriteMovie.Year,
                ImdbId = request.FavoriteMovie.ImdbId,
                Poster = request.FavoriteMovie.Poster
            };  

            _context.FavoriteMovies.Add(favoriteMovie);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to add favorite movie.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
