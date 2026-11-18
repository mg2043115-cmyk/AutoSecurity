using AutoSecurity.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoSecurity.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Administrador Padrão
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Administrador",
                Email = "admin@autosecurity.pt",
                Password = "admin123",
                Role = "Admin",
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Catálogo de Produtos Inicial
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Name = "Dashcam Pro 4K NightVision",
                Description = "Câmara frontal e traseira com visão noturna, gravação 4K e sensor G-Sensor.",
                Category = "Acessórios",
                CategoryId = 1,
                Brand = "AutoSecurity",
                Price = 129.99m,
                OldPrice = 159.99m,
                IsFeatured = true,
                ImageUrl = "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80"
            },
            new Product
            {
                Id = 2,
                Name = "Alarme GPS AutoSecurity Shield",
                Description = "Sistema de localização em tempo real com bloqueio remoto do motor via App.",
                Category = "Segurança",
                CategoryId = 2,
                Brand = "AutoSecurity",
                Price = 189.50m,
                OldPrice = null,
                IsFeatured = true,
                ImageUrl = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80"
            },
            new Product
            {
                Id = 3,
                Name = "BMW Série 3 M Sport",
                Description = "Veículo seminovo 2022, 45.000 km, histórico completo de revisões no concessionário.",
                Category = "Carros",
                CategoryId = 3,
                Brand = "BMW",
                Price = 34500.00m,
                OldPrice = 36900.00m,
                IsFeatured = true,
                ImageUrl = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80"
            },
            new Product
            {
                Id = 4,
                Name = "Audi RS6 Avant Performance",
                Description = "V8 4.0 TFSI 600cv, tração Quattro, escape desportivo RS, estado irrepreensível.",
                Category = "Carros",
                CategoryId = 3,
                Brand = "Audi",
                Price = 118000.00m,
                OldPrice = null,
                IsFeatured = false,
                ImageUrl = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80"
            }
        );
    }
}