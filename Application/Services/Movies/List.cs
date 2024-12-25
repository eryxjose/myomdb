using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Services.Movies;

public class List
{
    public class Query : IRequest<Result<MovieSearchResult>>
    {
        public MovieParams MovieParams { get; set; } // Parâmetros de pesquisa para filmes
    }

    public class Handler : IRequestHandler<Query, Result<MovieSearchResult>>
    {
        private readonly IOmdbApiService _omdbApiService;
        private readonly ILogger<List> _logger;

        public Handler(IOmdbApiService omdbApiService, ILogger<List> logger)
        {
            _omdbApiService = omdbApiService;
            _logger = logger;
        }

        public async Task<Result<MovieSearchResult>> Handle(Query request, CancellationToken cancellationToken)
        {
            // Busca na API OMDb
            var omdbResult = await _omdbApiService.SearchMovies(request.MovieParams.Search, request.MovieParams.PageNumber);

            if (omdbResult == null || omdbResult.Search == null)
            {
                _logger.LogWarning("List.Handler.Handle - No movies found in OMDb API for search term: {Search}", request.MovieParams.Search);
                return Result<MovieSearchResult>.Failure("No movies found");
            }

            return Result<MovieSearchResult>.Success(omdbResult);
        }
    }
}