namespace Backend.DTOs.Responses.Auth;

public record class RolesDtoResponse
{
    public string Name { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
}
