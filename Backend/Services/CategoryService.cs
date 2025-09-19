using System;
using Backend.DTOs.Requests.Category;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class CategoryService : ICategoryService
{
    public Task<CategoryDto> CreateAsync(CreateCategorybRequest categorybRequest)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<CategoryDto> GetByIdAsync()
    {
        throw new NotImplementedException();
    }

    public Task<bool> RemoveAsync(string categoryId)
    {
        throw new NotImplementedException();
    }

    public Task<CategoryDto> UpdateAsync(UpdateCategoryrequest updateCategoryrequest)
    {
        throw new NotImplementedException();
    }
}
