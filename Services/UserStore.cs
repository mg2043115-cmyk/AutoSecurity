namespace AutoSecurity.Services;

public class AppUser
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UserStore
{
    // lista partilhada enquanto a app corre
    private static readonly List<AppUser> _users = new()
    {
        // utilizador de teste já existente
        new AppUser
        {
            Name = "Administrador",
            Email = "admin@autosecurity.pt",
            Password = "admin123"
        }
    };

    private static readonly object _lock = new();

    public AppUser? FindByEmail(string email)
    {
        lock (_lock)
        {
            return _users.FirstOrDefault(u =>
                u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }
    }

    public bool EmailExists(string email) => FindByEmail(email) is not null;

    public void Add(AppUser user)
    {
        lock (_lock)
        {
            _users.Add(user);
        }
    }
}