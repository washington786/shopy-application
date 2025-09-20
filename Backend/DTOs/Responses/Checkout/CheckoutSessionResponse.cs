namespace Backend.DTOs.Responses.Checkout;

public record class CheckoutSessionResponse
{
    public string SessionId { get; set; } = string.Empty;
    public string SessionUrl { get; set; } = string.Empty;

    public int OrderId { get; set; }
}
