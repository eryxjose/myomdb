using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Interfaces;
using Infrastructure.Movies;
using Application.Mappings;
using MediatR;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddCors(opt => 
        {
            opt.AddPolicy("CorsPolicy", policy => 
            {
                policy.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:3000","https://localhost:3000");
            });
        });

        services.AddEndpointsApiExplorer();
        services.AddDbContext<DataContext>(opt => 
        {
            //opt.UseSqlite("Data Source=app.db");
            opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });

        services.AddHttpContextAccessor();
        services.AddMediatR(typeof(Application.Services.Favorites.List.Handler).Assembly);
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);
        services.AddScoped<IOmdbApiService, OmdbApiService>();
        services.AddHttpClient<IOmdbApiService, OmdbApiService>();

        return services;
    }
}
