using System;
using System.Security.Claims;
using Backend.DTOs.Requests.Auth;
using Backend.DTOs.Responses.Auth;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using TaskManager.Services;

namespace Backend.Services;

public class AuthService(UserManager<AppUser> userManager, TokenService service, ILogger<AuthService> logger, IHttpContextAccessor httpContextAccessor) : IAuthService
{
    private readonly UserManager<AppUser> manager = userManager;
    private readonly TokenService tokenService = service;

    private readonly ILogger<AuthService> log = logger;

    private readonly IHttpContextAccessor httpContext = httpContextAccessor;



    public async Task<AuthResponse> LoginUser(LoginRequest loginRequest)
    {
        var user = await manager.FindByEmailAsync(loginRequest.Email);

        if (user is null && await manager.CheckPasswordAsync(user!, loginRequest.Password))
        {
            throw new UnauthorizedAccessException("Sorry, invalid credentials.");
        }

        var roles = await manager.GetRolesAsync(user!);
        var token = tokenService.GenerateToken(user!, roles);

        var userDto = new UserDto
        (
            user!.Id,
            user.Email!,
            user!.FullName,
            roles.ToList()!
        );

        var response = new AuthResponse(token, userDto);

        return response;

    }

    public async Task<AuthResponse> RegisterUser(RegisterReequest registerReequest)
    {
        // check if user exists
        var existing = await manager.FindByEmailAsync(registerReequest.Email);
        if (existing is not null)
        {
            throw new InvalidOperationException($"User with email {registerReequest.Email} already exists!."); ;
        }
        // create user

        var user = new AppUser() { Email = registerReequest.Email, FullName = registerReequest.FullName };
        var results = await manager.CreateAsync(user, registerReequest.Password);

        // if user not created, throw an exception
        if (!results.Succeeded)
        {
            var errors = string.Join(", ", results.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to create account.\n{errors}");
        }

        // assign user role
        await manager.AddToRoleAsync(user, "User");
        var roles = await manager.GetRolesAsync(user);
        var token = tokenService.GenerateToken(user!, roles);
        // response
        var userDto = new UserDto
         (
             user!.Id,
             user.Email!,
             user!.FullName,
             roles.ToList()!
         );

        var response = new AuthResponse(token, userDto);

        return response;

    }

    public async Task<UserDto> UpdateProfile(UpdateUserRequest updateUserRequest)
    {
        var claims = httpContext.HttpContext?.User;
        if (claims == null || !claims.Identity.IsAuthenticated)
        {
            throw new UnauthorizedAccessException("Unauthorized access.");
        }

        var user = await manager.GetUserAsync(claims);

        if (user is null)
        {
            throw new InvalidOperationException("User not found!");
        }

        if (!string.IsNullOrEmpty(updateUserRequest.Email))
        {
            user.Email = updateUserRequest.Email;
            user.UserName = updateUserRequest.Email;
        }

        if (!string.IsNullOrEmpty(updateUserRequest.FullName))
        {
            user.FullName = updateUserRequest.FullName;
        }

        if (updateUserRequest.Roles?.Any() == true)
        {
            var currentRoles = await manager.GetRolesAsync(user);
            var rolesToAdd = updateUserRequest.Roles.Except(currentRoles).ToList();
            var rolesToRemove = currentRoles.Except(updateUserRequest.Roles).ToList();

            if (rolesToRemove.Any())
            {
                var removeResult = await manager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!removeResult.Succeeded)
                {
                    var errors = string.Join(", ", removeResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to remove roles: {errors}");
                }
            }

            if (rolesToAdd.Any())
            {
                var addResult = await manager.AddToRolesAsync(user, rolesToAdd);
                if (!addResult.Succeeded)
                {
                    var errors = string.Join(", ", addResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to add roles: {errors}");
                }
            }
        }

        var res = await manager.UpdateAsync(user);

        var roles = await manager.GetRolesAsync(user);

        if (!res.Succeeded)
        {
            var errors = string.Join(", ", res.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to update profile. {errors}");
        }

        return new UserDto(user.Id, user.Email!, user.FullName, roles.ToList()!);

    }
    public async Task<bool> DeleteProfile(string userId)
    {
        var claims = httpContext.HttpContext?.User;
        if (claims == null || !claims.Identity.IsAuthenticated)
        {
            throw new UnauthorizedAccessException("Unauthorized access.");
        }

        var user = await manager.GetUserAsync(claims);

        if (user is null)
        {
            throw new UnauthorizedAccessException("Unauthorized access");
        }

        var updated = await manager.FindByIdAsync(userId);

        if (updated is null)
        {
            throw new InvalidOperationException("Sorry, user not found.");
        }

        updated.IsActive = false;

        var response = await manager.UpdateAsync(updated);

        if (!response.Succeeded)
        {
            throw new InvalidOperationException($"Failed to update account.\n{string.Join(", ", response.Errors.Select(e => e.Description))}");
        }

        return response.Succeeded ? true : false;
    }

    public async Task<UserDto> GetMyProfile()
    {
        var claims = httpContext.HttpContext?.User;
        if (claims == null || !claims.Identity.IsAuthenticated)
        {
            throw new UnauthorizedAccessException("Unauthorized access.");
        }

        var user = await manager.GetUserAsync(claims);

        if (user is null)
        {
            throw new UnauthorizedAccessException("Unauthorized access");
        }
        var roles = await manager.GetRolesAsync(user);

        var response = new UserDto(user.Id, user.Email!, user.FullName, roles.ToList()!);
        return response;
    }

}
