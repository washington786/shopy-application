using System;
using Backend.DTOs.Requests.Admin;
using Backend.DTOs.Requests.Auth;
using Backend.DTOs.Responses.Auth;

namespace Backend.Services.Interfaces;

public interface IAdminService
{
    Task AssignRoleToUserAsync(string userId, AssignRoleRequest assignRoleRequest);

    Task<List<UserDto>> FetchAllUsersAsync(int page = 1, int pageSize = 10);

    Task<List<RolesDtoResponse>> GetRoles();
}
