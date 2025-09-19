namespace Backend.DTOs.Requests.Auth;

public record class UserDto(string Id, string Email, string Fullname, List<string> Roles)
{

}
