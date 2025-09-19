namespace Backend.DTOs.Requests.Auth;

public record class UpdateUserRequest(string Email, string FullName, List<string> Roles)
{

}
