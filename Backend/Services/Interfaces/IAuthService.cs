using System;
using Backend.DTOs.Requests.Auth;
using Backend.DTOs.Responses.Auth;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginUser(LoginRequest loginRequest);
    Task<AuthResponse> RegisterUser(RegisterReequest registerReequest);

    Task<UserDto> GetMyProfile();

    Task<bool> DeleteProfile(string userId);

    Task<UserDto> UpdateProfile(UpdateUserRequest updateUserRequest);
}
