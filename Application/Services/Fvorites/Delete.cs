using Application.Core;
using MediatR;
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

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var favoriteMovie = await _context.FavoriteMovies.FindAsync(request.Id);

            if (favoriteMovie == null) return Result<Unit>.Failure("Favorite movie not found.");

            _context.FavoriteMovies.Remove(favoriteMovie);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete favorite movie.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}