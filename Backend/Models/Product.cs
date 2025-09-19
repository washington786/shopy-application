using System;

namespace Backend.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; } = string.Empty;

    public List<string>? ImageUrl { get; set; } = [];

    public int StockCount { get; set; }

    public decimal Price { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public int CategoryId { get; set; }

    public Category? Category { get; set; }

    public ICollection<OrderItem>? OrderItems { get; set; }
    public ICollection<CartItem>? CartItems { get; set; }
}
