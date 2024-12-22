using System;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DataContext : IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DbSet<FavoriteMovie> FavoriteMovies { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FavoriteMovie>()
            .HasKey(f => f.Id);

        modelBuilder.Entity<FavoriteMovie>()
            .Property(f => f.ImdbId)
            .IsRequired();

        base.OnModelCreating(modelBuilder);
    }
    
}
