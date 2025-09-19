using Backend.DTOs.Requests.Auth;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService service = authService;

        [HttpPost("register")]
        public async Task<ActionResult> RegisterAccount([FromBody] RegisterReequest registerReequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Sorry, invalid input fields." });
            }

            var res = await service.RegisterUser(registerReequest);

            return Ok(res);
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Sorry, invalid input fields." });
            }

            var res = await service.LoginUser(loginRequest);

            return Ok(res);
        }

        [HttpGet("my-profile")]
        public async Task<ActionResult> GetMyProfile()
        {
            var res = await service.GetMyProfile();
            return Ok(res);
        }

        [HttpPut("me")]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateUserRequest updateUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Sorry, invalid input fields." });
            }

            var res = await service.UpdateProfile(updateUserRequest);

            return Ok(res);
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteProfile(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "invalid user id" });
            }

            var res = await service.DeleteProfile(userId);

            return Ok(res);
        }

    }
}
