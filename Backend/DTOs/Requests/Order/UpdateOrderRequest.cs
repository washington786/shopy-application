namespace Backend.DTOs.Requests.Order;

public record class UpdateOrderRequest
{
    public string? Status { get; set; } = string.Empty;

    public int OrderId { get; set; }

    public int UpdatedBy { get; set; }

    public string? Notes { get; set; } = string.Empty;
}
