using System;
using Backend.Data;
using Backend.DTOs.Requests.Category;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class CategoryService(ApplicationDbContext dbContext) : ICategoryService
{
    private readonly ApplicationDbContext db = dbContext;

    public async Task<CategoryDto> CreateAsync(CreateCategorybRequest categorybRequest)
    {
        if (string.IsNullOrEmpty(categorybRequest.Description) || string.IsNullOrEmpty(categorybRequest.Name))
        {
            throw new InvalidOperationException("Invalid inputs");
        }

        var newCategory = new Category
        {
            Description = categorybRequest.Description,
            Name = categorybRequest.Name
        };

        await db.Categories.AddAsync(newCategory);
        await db.SaveChangesAsync();

        var category = new CategoryDto(newCategory.Id, newCategory.Description, newCategory.Name);
        return category;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await db.Categories.Select(e => new CategoryDto(e.Id, e.Name, e.Description)).ToListAsync();
        return categories;
    }

    public async Task<CategoryDto> GetByIdAsync(int categoryId)
    {
        if (categoryId < 0)
        {
            throw new InvalidOperationException("invalid category id");
        }

        var category = await db.Categories.FirstOrDefaultAsync(e => e.Id == categoryId);

        if (category is null)
        {
            throw new InvalidOperationException("Category not found");
        }

        var response = new CategoryDto(category.Id, category.Name, category.Description);

        return response;
    }

    public async Task<bool> RemoveAsync(int categoryId)
    {
        if (categoryId < 0)
        {
            throw new InvalidOperationException("invalid category id");
        }

        var category = await db.Categories.FirstOrDefaultAsync(e => e.Id == categoryId);
        if (category is null)
        {
            throw new InvalidOperationException("Category not found");
        }

        var response = db.Categories.Remove(category);
        await db.SaveChangesAsync();

        return true;
    }

    public async Task<CategoryDto> UpdateAsync(int categoryId, UpdateCategoryrequest updateCategoryrequest)
    {
        var category = await db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);

        if (category is null)
        {
            throw new InvalidOperationException("Category not found");
        }

        if (!string.IsNullOrEmpty(updateCategoryrequest.Description))
        {
            category.Description = updateCategoryrequest.Description;
        }
        if (!string.IsNullOrEmpty(updateCategoryrequest.Name))
        {
            category.Name = updateCategoryrequest.Name;
        }

        await db.SaveChangesAsync();

        var response = new CategoryDto(category.Id, category.Name, category.Description);
        return response;
    }
}
