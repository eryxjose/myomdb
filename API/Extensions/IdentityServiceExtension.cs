using System.Text;
using Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt =>
        {
            opt.Password.RequireDigit = true;                  // Exige ao menos um número
            opt.Password.RequiredLength = 4;                  // Exige ao menos 4 caracteres
            opt.Password.RequireNonAlphanumeric = false;       // Não exige caracteres especiais
            opt.Password.RequireUppercase = false;             // Não exige letras maiúsculas
            opt.Password.RequireLowercase = false;             // Não exige letras minúsculas
            opt.Password.RequiredUniqueChars = 1;             // Exige ao menos 1 caractere único

            opt.User.RequireUniqueEmail = true;                // Exige e-mails únicos
        })
            .AddEntityFrameworkStores<DataContext>();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt => 
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            
        services.AddScoped<TokenService>();

        return services;
    }
}
