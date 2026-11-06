using Microsoft.AspNetCore.Mvc;
using AutoSecurity.Models;
using AutoSecurity.Models.ViewModels;

namespace AutoSecurity.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        var categories = new List<Category>
        {
            new() { Id=1, Name="Travões", Slug="travoes" },
            new() { Id=2, Name="Óleo & Fluidos", Slug="oleo-fluidos" },
            new() { Id=3, Name="Iluminação", Slug="iluminacao" },
            new() { Id=4, Name="Ferramentas", Slug="ferramentas" },
            new() { Id=5, Name="Segurança", Slug="seguranca" },
            new() { Id=6, Name="Limpeza", Slug="limpeza" },
            new() { Id=7, Name="Bateria", Slug="bateria" },
            new() { Id=8, Name="Filtros", Slug="filtros" },
        };

        var products = new List<Product>
        {
            new() { Id=1, Name="Pastilhas de Travão Premium", Description="Travagem consistente e silenciosa.", Price=39.90m, OldPrice=49.90m, IsFeatured=true, CategoryId=1 },
            new() { Id=2, Name="Disco Ventilado", Description="Dissipação térmica superior.", Price=89.90m, IsFeatured=true, CategoryId=1 },
            new() { Id=3, Name="Óleo 5W30 Sintético (5L)", Description="Proteção máxima do motor.", Price=34.90m, OldPrice=39.90m, IsFeatured=true, CategoryId=2 },
            new() { Id=4, Name="Kit Lâmpadas LED H7", Description="Visibilidade forte e uniforme.", Price=24.90m, IsFeatured=true, CategoryId=3 },
            new() { Id=5, Name="Triângulo + Colete", Description="Essencial e obrigatório.", Price=12.50m, IsFeatured=true, CategoryId=5 },
            new() { Id=6, Name="Spray Limpeza Travões", Description="Remove óleo e resíduos.", Price=6.90m, OldPrice=8.90m, IsFeatured=false, CategoryId=6 },
            new() { Id=7, Name="Filtro de Óleo", Description="Manutenção simples e eficaz.", Price=7.90m, IsFeatured=true, CategoryId=8 },
            new() { Id=8, Name="Kit Chaves", Description="Ferramenta para a garagem.", Price=19.90m, IsFeatured=false, CategoryId=4 },
        };

        var vm = new HomeIndexVM
        {
            Categories = categories,
            Featured = products.Where(p => p.IsFeatured).Take(8).ToList(),
            Deals = products.Where(p => p.OldPrice != null && p.OldPrice > p.Price).Take(4).ToList(),
            Brands = new() { "Bosch", "NGK", "Brembo", "Valeo", "Mann-Filter", "Liqui Moly" }
        };

        return View(vm);
    }

    public IActionResult Privacy() => View();
}