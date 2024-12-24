using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services.Favorites;

public class List
{
    public class Query : IRequest<Result<PagedList<FavoriteMovie>>>
    {
        public PagingParams PagingParams { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<FavoriteMovie>>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<PagedList<FavoriteMovie>>> Handle(Query request, CancellationToken cancellationToken)
        {
            // Obter o usuário logado 
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername(), cancellationToken);

            if (user == null)
                return Result<PagedList<FavoriteMovie>>.Failure("Usuário não encontrado.");

            var query = _context.FavoriteMovies
                .OrderBy(x => x.Title)
                .Where(x => x.UserId == user.Id)
                .AsNoTracking()
                .AsQueryable();
                //.ToListAsync(cancellationToken);

            return Result<PagedList<FavoriteMovie>>.Success(
                await PagedList<FavoriteMovie>.CreateAsync(query, request.PagingParams.PageNumber, 
                    request.PagingParams.PageSize)
            );
        }
    }
}
