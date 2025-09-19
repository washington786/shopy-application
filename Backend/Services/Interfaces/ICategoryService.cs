using Backend.DTOs.Requests.Category;

namespace Backend.Services.Interfaces;

public interface ICategoryService
{
    Task<CategoryDto> CreateAsync(CreateCategorybRequest categorybRequest);
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> GetByIdAsync(int categoryId);
    Task<bool> RemoveAsync(int categoryId);
    Task<CategoryDto> UpdateAsync(int categoryId, UpdateCategoryrequest updateCategoryrequest);
}
