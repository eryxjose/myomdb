using System;
using Application.Services.Movies;
using Domain.Entities;

namespace Application.Interfaces;

public interface IOmdbApiService
{
    Task<MovieSearchResult> SearchMovies(string title, int page);
    Task<MovieDetail> GetMovieDetails(string id);
}
