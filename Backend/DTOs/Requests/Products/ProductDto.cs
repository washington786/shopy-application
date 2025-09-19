using Backend.Models;

namespace Backend.DTOs.Requests.Products;

public record class ProductDto(int Id, string Name, string Description, List<string> ImageUrls, int Stock, decimal Price, int CategoryId, DateTime CreatedAt, DateTime UpdatedAt, ICollection<OrderItem> OrderItems)
{

}
