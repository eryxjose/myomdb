using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

public class Delete
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
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

            var favoriteMovie = await _context.FavoriteMovies
                .FirstOrDefaultAsync(f => f.Id == request.Id && f.UserId == user.Id, cancellationToken);

            if (favoriteMovie == null)
                return Result<Unit>.Failure("Favorito não encontrado ou não pertence ao usuário logado.");

            _context.FavoriteMovies.Remove(favoriteMovie);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Erro ao excluir o favorito.");

            return Result<Unit>.Success(Unit.Value);
        }

    }
}