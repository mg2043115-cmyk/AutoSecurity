using AutoSecurity.Data;
using AutoSecurity.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace AutoSecurity.Controllers;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;

    public HomeController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        var featured = _context.Products.Where(p => p.IsFeatured).ToList();
        
        var model = new HomeIndexVM
        {
            FeaturedProducts = featured
        };

        return View(model);
    }

    public IActionResult Privacy()
    {
        return View();
    }
}