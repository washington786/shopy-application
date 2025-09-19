using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Requests.Auth;

public record class RegisterReequest([EmailAddress][Required] string Email, [Required][MinLength(6)] string Password, [Required][MinLength(3)] string FullName)
{

}
