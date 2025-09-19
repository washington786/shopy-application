using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Requests.Category;

public record class CreateCategorybRequest([Required] string Name, [Required] string Description)
{
}
