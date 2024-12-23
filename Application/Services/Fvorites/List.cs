using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services.Favorites;

public class List
{
    public class Query : IRequest<Result<List<FavoriteMovie>>>
    {
    }

    public class Handler : IRequestHandler<Query, Result<List<FavoriteMovie>>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<List<FavoriteMovie>>> Handle(Query request, CancellationToken cancellationToken)
        {
            // Obter o usuário logado 
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername(), cancellationToken);

            if (user == null)
                return Result<List<FavoriteMovie>>.Failure("Usuário não encontrado.");

            var favoriteMovies = await _context.FavoriteMovies
                .Where(x => x.UserId == user.Id)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Result<List<FavoriteMovie>>.Success(favoriteMovies);
        }
    }
}
