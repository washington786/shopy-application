using Backend.DTOs.Requests.Products;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// ToDO: pagination
namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(IProductService productService) : ControllerBase
    {
        private readonly IProductService service = productService;

        [HttpGet("all-products")]
        public async Task<ActionResult<string>> GetAllProductsAsync()
        {
            var res = await service.GetAllAsync();
            return Ok(res);
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult> GetProductByIdAsync(int productId)
        {
            var res = await service.GetByIdAsync(productId);
            return Ok(res);
        }

        [Authorize(Roles = "Admin,StoreManager")]
        [HttpPost("create-product")]
        public async Task<ActionResult> CreateProductAsync([FromBody] CreateProductRequest createProductRequest)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "invalid input fields" });

            var res = await service.CreateAsync(createProductRequest);
            return CreatedAtAction(nameof(GetProductByIdAsync), new { id = res.Id }, res);
        }
        [Authorize(Roles = "Admin,StoreManager")]
        [HttpPut("{productId}")]
        public async Task<ActionResult> UpdateProductAsync(int productId, [FromBody] UpdateProductRequest updateProduct)
        {
            if (!ModelState.IsValid) return BadRequest(new { message = "invalid input fields" });
            var res = await service.UpdateAsync(productId, updateProduct);
            return Ok(res);
        }
        [Authorize(Roles = "Admin,StoreManager")]
        [HttpDelete("{productId}")]
        public async Task<ActionResult> DeleteProductAsync(int productId)
        {
            await service.RemoveAsync(productId);

            return NoContent();
        }
    }
}
