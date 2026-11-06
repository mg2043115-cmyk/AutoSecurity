using System.Security.Claims;
using AutoSecurity.Models;
using AutoSecurity.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace AutoSecurity.Controllers;

public class AccountController : Controller
{
    private readonly UserStore _users;

    public AccountController(UserStore users)
    {
        _users = users;
    }

    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity is { IsAuthenticated: true })
            return RedirectToAction("Index", "Home");

        ViewData["ReturnUrl"] = returnUrl;
        return View(new LoginViewModel());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;

        if (!ModelState.IsValid)
            return View(model);

        var user = _users.FindByEmail(model.Email);
        if (user is null || user.Password != model.Password)
        {
            ModelState.AddModelError(string.Empty, "E-mail ou senha incorretos.");
            return View(model);
        }

        await SignInUserAsync(user.Name, user.Email, model.RememberMe);

        if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
            return LocalRedirect(returnUrl);

        return RedirectToAction("Index", "Home");
    }

    [HttpGet]
    public IActionResult Register()
    {
        if (User.Identity is { IsAuthenticated: true })
            return RedirectToAction("Index", "Home");

        return View(new RegisterViewModel());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        // opcional: incentivar Gmail (não bloqueia outros emails)
        // if (!model.Email.EndsWith("@gmail.com", StringComparison.OrdinalIgnoreCase))
        // {
        //     ModelState.AddModelError(nameof(model.Email), "Usa o teu Gmail (@gmail.com).");
        //     return View(model);
        // }

        if (_users.EmailExists(model.Email))
        {
            ModelState.AddModelError(nameof(model.Email), "Já existe uma conta com este e-mail.");
            return View(model);
        }

        var user = new AppUser
        {
            Name = model.Name.Trim(),
            Email = model.Email.Trim(),
            Password = model.Password
        };

        _users.Add(user);

        // depois de registar, já faz login automaticamente
        await SignInUserAsync(user.Name, user.Email, rememberMe: true);

        return RedirectToAction("Index", "Home");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Index", "Home");
    }

    private async Task SignInUserAsync(string name, string email, bool rememberMe)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Email, email)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = rememberMe,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
            });
    }
}