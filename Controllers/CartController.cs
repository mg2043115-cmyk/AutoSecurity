using AutoSecurity.Extensions;
using AutoSecurity.Models;
using Microsoft.AspNetCore.Mvc;

namespace AutoSecurity.Controllers;

public class CartController : Controller
{
    private const string CartSessionKey = "MyCart";

    // GET: /Cart
    public IActionResult Index()
    {
        var cart = GetCart();
        return View(cart);
    }

    // POST: adiciona um produto de teste (para veres o carrinho a funcionar)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult AddTestItem()
    {
        var cart = GetCart();

        var existing = cart.FirstOrDefault(x => x.Name == "Dashcam Pro 4K NightVision");
        if (existing is not null)
        {
            existing.Quantity += 1;
        }
        else
        {
            cart.Add(new CartItem
            {
                Id = 1,
                Name = "Dashcam Pro 4K NightVision",
                Category = "Acessórios",
                Price = 129.99m,
                Quantity = 1
            });
        }

        SaveCart(cart);
        return RedirectToAction(nameof(Index));
    }

    // POST: adicionar produto real (quando tiveres a loja)
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Add(int id, string name, decimal price, string category = "Geral", int qty = 1)
    {
        if (qty < 1) qty = 1;

        var cart = GetCart();
        var existing = cart.FirstOrDefault(x => x.Id == id);

        if (existing is not null)
        {
            existing.Quantity += qty;
        }
        else
        {
            cart.Add(new CartItem
            {
                Id = id,
                Name = name,
                Price = price,
                Category = category,
                Quantity = qty
            });
        }

        SaveCart(cart);
        return RedirectToAction(nameof(Index));
    }

    // POST: remover item
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Remove(int id)
    {
        var cart = GetCart();
        var item = cart.FirstOrDefault(c => c.Id == id);

        if (item is not null)
        {
            cart.Remove(item);
            SaveCart(cart);
        }

        return RedirectToAction(nameof(Index));
    }

    // POST: limpar carrinho
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Clear()
    {
        HttpContext.Session.Remove(CartSessionKey);
        return RedirectToAction(nameof(Index));
    }

    // ---- helpers ----
    private List<CartItem> GetCart()
    {
        return HttpContext.Session.Get<List<CartItem>>(CartSessionKey) ?? new List<CartItem>();
    }

    private void SaveCart(List<CartItem> cart)
    {
        HttpContext.Session.Set(CartSessionKey, cart);
    }
}