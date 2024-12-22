namespace Domain.Entities
{
    public class FavoriteMovie
    {
        public Guid Id { get; set; }          // Identificador único no banco
        public string ImdbId { get; set; }    // Identificador único do filme (OMDb)
        public string Title { get; set; }     // Título do filme
        public string Year { get; set; }      // Ano de lançamento
        public string Poster { get; set; }    // URL do poster do filme
        public DateTime AddedAt { get; set; } // Data em que foi adicionado aos favoritos

        // Relacionamento com o usuário
        public string UserId { get; set; }    // Identificador do usuário
        public AppUser User { get; set; }     // Navegação para o usuário
    }
}

