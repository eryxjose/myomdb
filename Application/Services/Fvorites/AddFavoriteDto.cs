namespace Application.Services.Fvorites;

public class AddFavoriteDto
{
    public string ImdbId { get; set; }  // Identificador único do filme na API OMDb
    public string Title { get; set; }   // Título do filme
    public string Year { get; set; }    // Ano de lançamento do filme
    public string Poster { get; set; }  // URL do poster do filme
}

