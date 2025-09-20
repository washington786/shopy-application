using Backend.Data;
using Backend.DTOs.Requests.Products;
using Backend.DTOs.Responses.Products;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class ProductService(ApplicationDbContext applicationDbContext) : IProductService
{
    private readonly ApplicationDbContext dbContext = applicationDbContext;

    public async Task<ProductDto> CreateAsync(CreateProductRequest createProductRequest)
    {
        var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == createProductRequest.CategoryId);
        if (category is null) throw new KeyNotFoundException("Category not found");
        var product = new Product()
        {
            Name = createProductRequest.Name,
            Price = createProductRequest.Price,
            Description = createProductRequest.Description,
            ImageUrl = createProductRequest.ImageUrls,
            StockCount = createProductRequest.Stock,
            CategoryId = createProductRequest.CategoryId,
            Category = category,
            CreatedAt = DateTime.UtcNow
        };

        await dbContext.Products.AddAsync(product);
        await SaveAsync();
        await dbContext.Entry(product).Reference(c => c.Category).LoadAsync();
        return GetProductDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await dbContext.Products.Include(p => p.Category).ToListAsync();
        return products.Select(GetProductDto);
    }

    public async Task<ProductDto> GetByIdAsync(int productId)
    {

        var product = await FindProduct(productId);
        if (product is null) throw new KeyNotFoundException("Product not found.");
        if (product.Category is null)
        {
            await dbContext.Entry(product).Reference(p => p.Category).LoadAsync();
        }
        return GetProductDto(product);
    }

    public async Task<bool> RemoveAsync(int productId)
    {
        var product = await FindProduct(productId);
        if (product is null)
        {
            throw new KeyNotFoundException("Product not found.");
            // return false;
        }
        ;

        dbContext.Products.Remove(product);
        await SaveAsync();

        return true;
    }

    public async Task<ProductDto> UpdateAsync(int productId, UpdateProductRequest updateProductRequest)
    {
        var product = await FindProduct(productId);
        if (product is null) throw new KeyNotFoundException("Product not found.");

        var category = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == updateProductRequest.CategoryId);

        if (category is null) throw new KeyNotFoundException("Invalid category");

        product.Name = updateProductRequest.Name;
        product.Description = updateProductRequest.Description;
        product.StockCount = updateProductRequest.Stock;
        product.Price = updateProductRequest.Price;
        product.UpdatedAt = DateTime.UtcNow;
        product.CategoryId = updateProductRequest.CategoryId;

        dbContext.Products.Update(product);

        if (product.Category is null || product.CategoryId != category.Id)
        {
            await dbContext.Entry(product).Reference(p => p.Category).LoadAsync();
        }

        await SaveAsync();

        return GetProductDto(product);
    }

    private static ProductDto GetProductDto(Product product)
    {
        return new ProductDto(product.Id, product.Name, product.Description, product.ImageUrl, product.StockCount, product.Price, product.CategoryId, product.Category.Name ?? "Unknown", product.CreatedAt, product.UpdatedAt);
    }

    private async Task SaveAsync()
    {
        await dbContext.SaveChangesAsync();
    }

    private async Task<Product?> FindProduct(int productId)
    {
        return await dbContext.Products.FirstOrDefaultAsync(prod => prod.Id == productId);
    }
}
