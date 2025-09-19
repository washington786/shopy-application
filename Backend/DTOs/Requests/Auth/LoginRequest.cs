using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Requests.Auth;

public record class LoginRequest([EmailAddress][Required] string Email, [Required] string Password)
{

}
