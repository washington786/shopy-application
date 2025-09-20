namespace Backend.DTOs.Responses.Orders;

public record class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public List<OrderItemdto> Items { get; set; } = [];
    public int? PaymentId { get; set; }
}
