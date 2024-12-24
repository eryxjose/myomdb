// src/app/models/movie.ts
export interface MovieSummary {
    title: string;     // Título do filme
    year: string;      // Ano de lançamento
    imdbID: string;    // Identificador único do filme no IMDb
    type: string;      // Tipo do item (e.g., "movie", "series")
    poster: string;    // URL do poster do filme
}

// src/app/models/movie.ts
export interface MovieDetail {
    title: string;       // Título do filme
    year: string;        // Ano de lançamento
    imdbID: string;      // Identificador único do filme no IMDb
    type: string;        // Tipo do item (e.g., "movie", "series")
    poster: string;      // URL do poster do filme
    genre: string;       // Gênero do filme
    director: string;    // Nome(s) do(s) diretor(es)
    actors: string;      // Nome(s) do(s) ator(es)
    plot: string;        // Sinopse do filme
    language: string;    // Idioma do filme
    country: string;     // País de origem
    awards: string;      // Prêmios recebidos
    imdbRating: string;  // Nota do filme no IMDb
    imdbvotes: string;   // Número de votos no IMDb
    runtime: string;     // Duração do filme
    released: string;    // Data de lançamento
}
