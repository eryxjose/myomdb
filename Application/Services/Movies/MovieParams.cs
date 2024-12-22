using Application.Core;

namespace Application.Services.Movies;

public class MovieParams : PagingParams
{
    public string Search { get; set; } // Termo de busca para filmes
}
