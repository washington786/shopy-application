using System;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services;

public class RoleSeederService(RoleManager<IdentityRole> roleManager) : IRoleService
{
    private readonly RoleManager<IdentityRole> roleManager = roleManager;

    public async Task CreateRoleSeeding()
    {
        string[] roles = ["Admin", "User", "StoreManager"];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                System.Console.WriteLine($"Role Created successfully!{role}");
            }
        }
    }


}
