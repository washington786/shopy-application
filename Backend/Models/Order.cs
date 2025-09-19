using System;

namespace Backend.Models;

public class Order
{
    public int Id { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";

    public string UserId { get; set; } = string.Empty;

    public AppUser User { get; set; } = null!;

    public ICollection<OrderItem> OrderItems { get; set; } = null!;

    public int PaymentId { get; set; }
    public Payment? Payment { get; set; }
}
