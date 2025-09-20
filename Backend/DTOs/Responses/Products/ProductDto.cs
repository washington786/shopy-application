using Backend.Models;

namespace Backend.DTOs.Responses.Products;

public record class ProductDto(int Id, string Name, string Description, List<string> ImageUrls, int Stock, decimal Price, int? CategoryId, string? CategoryName, DateTime? CreatedAt, DateTime? UpdatedAt)
{

}