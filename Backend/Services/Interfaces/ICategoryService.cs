using Backend.DTOs.Requests.Category;

namespace Backend.Services.Interfaces;

public interface ICategoryService
{
    Task<CategoryDto> CreateAsync(CreateCategorybRequest categorybRequest);
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> GetByIdAsync();
    Task<bool> RemoveAsync(string categoryId);
    Task<CategoryDto> UpdateAsync(UpdateCategoryrequest updateCategoryrequest);
}
