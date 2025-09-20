using Backend.DTOs.Requests.Products;
using Backend.DTOs.Responses.Products;

namespace Backend.Services.Interfaces;

public interface IProductService
{
    Task<ProductDto> CreateAsync(CreateProductRequest createProductRequest);
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto> GetByIdAsync(int productId);
    Task<bool> RemoveAsync(int productId);
    Task<ProductDto> UpdateAsync(int productId, UpdateProductRequest updateProductRequest);
}
