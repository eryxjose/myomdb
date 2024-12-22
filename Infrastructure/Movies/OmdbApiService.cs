using System.Net.Http.Json;
using Application.Interfaces;
using Application.Services.Movies;
using Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Movies
{
    public class OmdbApiService : IOmdbApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiUrl;

        public OmdbApiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OmdbApi:OmdbApiKey"];
            _apiUrl = configuration["OmdbApi:OmdbApiUrl"];
        }

        // Busca filmes com base no título e na página
        public async Task<MovieSearchResult> SearchMovies(string title, int page)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("O título do filme não pode ser vazio.");

            var response = await _httpClient.GetAsync($"{_apiUrl}?s={title}&page={page}&apikey={_apiKey}");

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Falha ao buscar filmes: {response.ReasonPhrase}");

            var result = await response.Content.ReadFromJsonAsync<MovieSearchResult>();
            if (result == null || result.Response != "True")
                throw new Exception("Nenhum filme encontrado ou erro na resposta da API.");

            return result;
        }

        // Busca detalhes de um filme específico
        public async Task<MovieDetail> GetMovieDetails(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                throw new ArgumentException("O ID do filme não pode ser vazio.");

            var response = await _httpClient.GetAsync($"{_apiUrl}?i={id}&apikey={_apiKey}");

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Falha ao buscar detalhes do filme: {response.ReasonPhrase}");

            var result = await response.Content.ReadFromJsonAsync<MovieDetail>();
            if (result == null || string.IsNullOrEmpty(result.Title))
                throw new Exception("Nenhum detalhe encontrado ou erro na resposta da API.");

            return result;
        }
    }
}
