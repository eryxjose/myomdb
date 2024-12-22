using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Services.Movies;

public class Details
{
    public class Query : IRequest<Result<MovieDetail>>
    {
        public string ImdbID { get; set; } // IMDb ID do filme para busca
    }

    public class Handler : IRequestHandler<Query, Result<MovieDetail>>
    {
        private readonly IOmdbApiService _omdbApiService;
        private readonly ILogger<Details> _logger;

        public Handler(IOmdbApiService omdbApiService, ILogger<Details> logger)
        {
            _omdbApiService = omdbApiService;
            _logger = logger;
        }

        public async Task<Result<MovieDetail>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var movieDetails = await _omdbApiService.GetMovieDetails(request.ImdbID);

                if (movieDetails == null)
                    return Result<MovieDetail>.Failure("Detalhes do filme não encontrados.");

                return Result<MovieDetail>.Success(movieDetails);
            }
            catch (Exception ex)
            {
                return Result<MovieDetail>.Failure($"Erro ao buscar detalhes do filme: {ex.Message}");
            }
        }
    }
}