using Backend.DTOs.Requests.Order;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(IOrderService orderService, UserManager<AppUser> userManager) : ControllerBase
    {
        private readonly IOrderService service = orderService;
        private readonly UserManager<AppUser> userManager = userManager;

        [HttpPost("create-order")]
        public async Task<ActionResult> AddOrderAsync([FromBody] CreateOrderRequest createOrderRequest)
        {
            if (!ModelState.IsValid) return BadRequest("Invalid inputs");

            var user = await userManager.GetUserAsync(User);

            if (user is null) return Unauthorized();

            var res = await service.AddOrderasync(user.Id, createOrderRequest);

            return Ok(res);
        }

        [HttpGet("all-orders")]
        public async Task<ActionResult> GetAllOrderAsync()
        {
            var user = await userManager.GetUserAsync(User);

            if (user is null) return Unauthorized();

            var res = await service.GetOrders(user.Id);

            return Ok(res);
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult> GetAsync(int orderId)
        {
            if (orderId < 0) return BadRequest(new { message = "invalid order id" });

            var user = await userManager.GetUserAsync(User);

            if (user is null) return Unauthorized();

            var res = await service.GetOrderByAsync(user.Id, orderId);

            return Ok(res);
        }

        [HttpPut("status")]
        public async Task<ActionResult> UpdateOrderStatusAsync([FromBody] UpdateOrderRequest updateOrder)
        {
            if (!ModelState.IsValid) return BadRequest("Invalid inputs");

            var user = await userManager.GetUserAsync(User);

            if (user is null) return Unauthorized();

            var res = await service.UpdateOrderStatusAsync(user.Id, updateOrder);

            return Ok(res);
        }
    }
}
