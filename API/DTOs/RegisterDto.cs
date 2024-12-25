using System.ComponentModel.DataAnnotations;
using Domain;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,14}$", ErrorMessage = "Password must have 1 uppercase, 1 lowercase, 1 number, 1 non alphanumeric and at least 4 and maximum 14 characters")]
    public string Password { get; set; }
    
    [Required]
    public string DisplayName { get; set; }

    [Required]
    public string Username { get; set; }

}
