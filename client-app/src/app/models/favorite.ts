export interface FavoriteMovie {
    id: string;          // Identificador único no banco de dados
    imdbId: string;      // Identificador único do filme (OMDb)
    title: string;       // Título do filme
    year: string;        // Ano de lançamento
    poster: string;      // URL do poster do filme
    addedAt: Date;       // Data em que foi adicionado aos favoritos
}
