
using AutoSecurity.Models;

namespace AutoSecurity.Models.ViewModels;

public class HomeIndexVM
{
    public List<Product> FeaturedProducts { get; set; } = new();
    public object? SearchModel { get; set; }
}