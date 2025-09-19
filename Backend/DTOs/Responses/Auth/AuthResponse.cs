using Backend.DTOs.Requests.Auth;

namespace Backend.DTOs.Responses.Auth;

public record class AuthResponse(string Token, UserDto UserDto)
{

}
