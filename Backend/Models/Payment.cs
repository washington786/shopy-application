using System;

namespace Backend.Models;

public class Payment
{
    public int Id { get; set; }
    public decimal Amount { get; set; }

    public string Provider { get; set; } = "Stripe";

    public string Status { get; set; } = "Pending";

    public string? SessionId { get; set; }

    public string? TransactionId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

}
