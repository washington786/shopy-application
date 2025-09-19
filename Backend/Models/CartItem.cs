using System;

namespace Backend.Models;

public class CartItem
{
    public int Id { get; set; }

    public int Quantity { get; set; }

    public string UserId { get; set; } = string.Empty;

    public int ProductId { get; set; }

    public AppUser Users { get; set; } = null!;

    public Product Product { get; set; } = null!;
}
