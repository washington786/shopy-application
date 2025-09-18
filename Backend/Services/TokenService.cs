using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace TaskManager.Services;

public class TokenService(IConfiguration configuration)
{
    private readonly IConfiguration _config = configuration;

    public string GenerateToken(AppUser user, IEnumerable<string> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier,user.Id),
            new(ClaimTypes.Email, user.Email!),
        };

        foreach (var role in roles)
        {
            claims.Add(new(ClaimTypes.Role, role));
        }

        var jwtSettings = _config.GetSection("Jwt");
        var key = jwtSettings["Key"];

        Console.WriteLine(jwtSettings["Key"]);
        var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));

        var credentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}