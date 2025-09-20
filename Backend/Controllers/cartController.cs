using Backend.DTOs.Requests.Cart;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(UserManager<AppUser> userManager, ICartService service) : ControllerBase
    {
        private readonly UserManager<AppUser> userManager = userManager;
        private readonly ICartService service = service;
        [HttpPost("add-to-cart")]
        public async Task<ActionResult> AddToCartAsync([FromBody] AddToCartRequest addToCart)
        {
            var user = await userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var res = await service.AddToCartAsync(user.Id, addToCart);

            return Ok(res);
        }

        [HttpGet("my-cart-items")]
        public async Task<ActionResult> GetCartAsync()
        {
            var user = await userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var res = await service.GetCartAsync(user.Id);

            return Ok(res);
        }

        [HttpPut("{cartId}")]
        public async Task<ActionResult> UpdateCartAsync(int cartId, [FromBody] UpdateCartRequest updateCart)
        {
            var user = await userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var res = await service.UpdateCartAsync(user.Id, cartId, updateCart);
            return Ok(res);
        }

        [HttpDelete("{cartItemId}")]
        public async Task<ActionResult> RemoveFromCartAsync(int cartItemId)
        {
            var user = await userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var res = await service.RemoveFromCartAsync(user.Id, cartItemId);

            if (!res) return NotFound();

            return NoContent();
        }

        [HttpDelete("clear-cart")]
        public async Task<ActionResult> ClearcartAsync()
        {
            var user = await userManager.GetUserAsync(User);
            if (user is null) return Unauthorized();

            var res = await service.ClearCartAsync(user.Id);

            return NoContent();
        }
    }
}
