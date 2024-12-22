using Domain.Entities;

namespace Application.Services.Movies;

public class MovieSearchResult
{
    public List<MovieSummary> Search { get; set; }
    public string TotalResults { get; set; }
    public string Response { get; set; }
}
