namespace Backend.DTOs.Requests.Products;

public record class CreateProductRequest(string Name, string Description, List<string> ImageUrls, int Stock, decimal Price, int CategoryId)
{

}
