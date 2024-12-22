using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class AppUser : IdentityUser
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string DisplayName { get; set; }
        public DateTime RegistrationDate { get; set; }

        // Relacionamento com filmes favoritos
        public ICollection<FavoriteMovie> FavoriteMovies { get; set; } = new List<FavoriteMovie>();
    }
}
