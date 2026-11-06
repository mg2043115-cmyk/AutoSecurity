
using AutoSecurity.Models;

namespace AutoSecurity.Models.ViewModels;

public class HomeIndexVM
{
    public List<Category> Categories { get; set; } = new();
    public List<Product> Featured { get; set; } = new();
    public List<Product> Deals { get; set; } = new();
    public List<string> Brands { get; set; } = new();
}