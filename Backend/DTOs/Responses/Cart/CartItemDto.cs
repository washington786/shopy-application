using System;

namespace Backend.DTOs.Responses.Cart;

public class CartItemDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string? ProductImageUrl { get; set; }

    public decimal ProductPrice { get; set; }

    public int Quantity { get; set; }

    public decimal TotalAmount { get; set; }

}
