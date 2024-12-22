using Application.Core;
using Domain.Entities;
using MediatR;
using Persistence;

public class Create
{
    public class Command : IRequest<Result<Unit>>
    {
        public FavoriteMovie FavoriteMovie { get; set; }
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
            _context.FavoriteMovies.Add(request.FavoriteMovie);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to add favorite movie.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
