using Backend.DTOs.Requests.Admin;
using Backend.DTOs.Requests.Auth;
using Backend.DTOs.Responses.Auth;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AdminService(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager) : IAdminService
{
    private readonly UserManager<AppUser> userManager = userManager;
    private readonly RoleManager<IdentityRole> roleManager = roleManager;

    public async Task AssignRoleToUserAsync(string userId, AssignRoleRequest assignRoleRequest)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException("User not found.");

        // Validate all roles exist
        foreach (var role in assignRoleRequest.Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                throw new ArgumentException($"Role '{role}' does not exist.");
        }

        // Get current roles
        var currentRoles = await userManager.GetRolesAsync(user);

        // Remove user from roles not in request
        var rolesToRemove = currentRoles.Except(assignRoleRequest.Roles).ToList();
        if (rolesToRemove.Any())
            await userManager.RemoveFromRolesAsync(user, rolesToRemove);

        // Add user to new roles
        var rolesToAdd = assignRoleRequest.Roles.Except(currentRoles).ToList();
        if (rolesToAdd.Any())
            await userManager.AddToRolesAsync(user, rolesToAdd);
    }

    public async Task<List<UserDto>> FetchAllUsersAsync(int page = 1, int pageSize = 10)
    {
        var users = userManager.Users.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);

            userDtos.Add(new UserDto(user.Id, user.Email, user.FullName, [.. roles]));
        }
        return userDtos;
    }

    public async Task<List<RolesDtoResponse>> GetRoles()
    {
        var roles = await roleManager.Roles.Select(e => new RolesDtoResponse { Id = e.Id, Name = e.Name }).ToListAsync();
        return roles;
    }
}
