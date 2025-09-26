using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController(IPaymentService paymentService, UserManager<AppUser> userManager) : ControllerBase
    {
        private readonly IPaymentService service = paymentService;
        private readonly UserManager<AppUser> _usermanager = userManager;

        [HttpPost("order-payment")]
        public async Task<ActionResult> MakeOrderPaymentAsync()
        {
            var user = await _usermanager.GetUserAsync(User);

            if (user is null) return Unauthorized();

            var res = await service.CreateCheckOut(user.Id);

            return Ok(res);
        }

        [HttpPut("confirm")]
        public async Task<ActionResult> ConfirmPayment(string sessionId)
        {
            var res = await service.ConfirmPayment(sessionId);
            return Ok(res);
        }
    }
}
