using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Requests.Order;

public record class ConfirmPaymentDto
{
    [Required]
    public required string SessionId { get; set; }

}
