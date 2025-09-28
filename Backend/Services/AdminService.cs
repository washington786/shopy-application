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
        {
            Console.WriteLine($"DEBUG: User with ID '{userId}' not found.");
            throw new KeyNotFoundException("User not found.");
        }

        Console.WriteLine($"DEBUG: Found user '{user.UserName}'. Current roles: {string.Join(", ", await userManager.GetRolesAsync(user))}");
        Console.WriteLine($"DEBUG: Requested roles: {string.Join(", ", assignRoleRequest.Roles)}");

        // Validate all roles exist
        foreach (var role in assignRoleRequest.Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                Console.WriteLine($"DEBUG: Role '{role}' does not exist.");
                throw new ArgumentException($"Role '{role}' does not exist.");
            }
        }

        // Get current roles
        var currentRoles = await userManager.GetRolesAsync(user);
        Console.WriteLine($"DEBUG: Current roles fetched: {string.Join(", ", currentRoles)}");

        // Remove user from roles not in request
        var rolesToRemove = currentRoles.Except(assignRoleRequest.Roles).ToList();
        if (rolesToRemove.Any())
        {
            Console.WriteLine($"DEBUG: Removing roles: {string.Join(", ", rolesToRemove)}");
            var removeResult = await userManager.RemoveFromRolesAsync(user, rolesToRemove);
            if (!removeResult.Succeeded)
            {
                // Log the specific errors from UserManager
                Console.WriteLine($"DEBUG: UserManager RemoveFromRolesAsync failed: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}");
                throw new InvalidOperationException($"Failed to remove user from roles: {string.Join(", ", removeResult.Errors.Select(e => e.Description))}");
            }
        }

        // Add user to new roles
        var rolesToAdd = assignRoleRequest.Roles.Except(currentRoles).ToList();
        if (rolesToAdd.Any())
        {
            Console.WriteLine($"DEBUG: Adding roles: {string.Join(", ", rolesToAdd)}");
            var addResult = await userManager.AddToRolesAsync(user, rolesToAdd);
            if (!addResult.Succeeded)
            {
                // Log the specific errors from UserManager
                Console.WriteLine($"DEBUG: UserManager AddToRolesAsync failed: {string.Join(", ", addResult.Errors.Select(e => e.Description))}");
                throw new InvalidOperationException($"Failed to add user to roles: {string.Join(", ", addResult.Errors.Select(e => e.Description))}");
            }
        }

        Console.WriteLine($"DEBUG: Roles updated successfully for user '{user.UserName}'.");
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
