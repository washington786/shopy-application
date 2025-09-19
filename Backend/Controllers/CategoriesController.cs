using Backend.DTOs.Requests.Category;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(ICategoryService service) : ControllerBase
    {
        private readonly ICategoryService _service = service;

        [HttpGet("all")]
        public async Task<ActionResult> GetAllAsync()
        {
            var categories = await _service.GetAllAsync();
            return Ok(categories);
        }

        [HttpGet("{categoryId}")]
        public async Task<ActionResult> GetByIdAsync(int categoryId)
        {
            var category = await _service.GetByIdAsync(categoryId);

            return Ok(category);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateAsync([FromBody] CreateCategorybRequest categorybRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input fields" });
            }

            var created = await _service.CreateAsync(categorybRequest);

            return Ok(created);
        }

        [HttpPut("{categoryId}")]
        public async Task<ActionResult> UpdateAsync(int categoryId, [FromBody] UpdateCategoryrequest categoryrequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input fields" });
            }

            var response = await _service.UpdateAsync(categoryId, categoryrequest);
            return Ok(response);
        }

        [HttpDelete("{categoryId}")]
        public async Task<ActionResult> DeleteAsync(int categoryId)
        {
            await _service.RemoveAsync(categoryId);
            return NoContent();
        }
    }
}
