namespace Backend.DTOs.Requests.Admin;

public record class AssignRoleRequest
{
    public List<string> Roles { get; set; } = [];
}
