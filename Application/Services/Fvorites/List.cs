using Application.Core;
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

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<FavoriteMovie>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var favoriteMovies = await _context.FavoriteMovies
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Result<List<FavoriteMovie>>.Success(favoriteMovies);
        }
    }
}
