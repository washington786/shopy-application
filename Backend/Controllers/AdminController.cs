using Backend.DTOs.Requests.Admin;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController(IAdminService adminService) : ControllerBase
    {
        private readonly IAdminService service = adminService;

        [HttpPut("user/{userId}/roles")]
        public async Task<ActionResult> AssignUserRoleAsync(string userId, [FromBody] AssignRoleRequest assignRole)
        {
            if (ModelState.IsValid) return BadRequest();

            await service.AssignRoleToUserAsync(userId, assignRole);

            return Ok(new { message = "Role updated successfully" });
        }

        [HttpGet("all-users")]
        public async Task<ActionResult<string>> GetActiveUsersAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var res = await service.FetchAllUsersAsync(page, pageSize);
            return Ok(res);
        }

        [HttpGet("roles")]
        public async Task<ActionResult> GetRolesAsync()
        {
            var roles = await service.GetRoles();

            return Ok(roles);
        }
    }
}
