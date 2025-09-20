using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace BackendAPI.Utils;

public class DependencyHelper(IConfiguration configuration, IServiceCollection services)
{

    private readonly IConfiguration _config = configuration;
    private readonly IServiceCollection _service = services;

    public void SwaggerConfig()
    {
        _service.AddSwaggerGen((options) =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Shopy API", Version = "v1" });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter bearer token {token}",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme{
                        Reference= new OpenApiReference{
                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });

            // options.TagActionsBy(api =>
            // {
            //     if (api.ActionDescriptor.EndpointMetadata.OfType<AuthorizeAttribute>().Any())
            //     {
            //         var roles = api.ActionDescriptor.EndpointMetadata
            //             .OfType<AuthorizeAttribute>()
            //             .SelectMany(a => a.Roles?.Split(',') ?? [])
            //             .Distinct()
            //             .ToList();

            //         if (roles.Count > 0)
            //             return [$"{string.Join("/", roles)}"];
            //     }
            //     return ["Public"];
            // });

        });
    }

    public void DbConnectionCtx()
    {
        var connection_db = _config.GetConnectionString("DefaultConnection");
        _service.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connection_db));
    }

    public void IdentityAdding()
    {
        _service.AddIdentity<AppUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
    }

    public void AddAuthentication()
    {
        var jwt = _config.GetSection("Jwt");
        _service.AddAuthentication(op =>
        {
            op.DefaultChallengeScheme = "Bearer";
            op.DefaultAuthenticateScheme = "Bearer";
        }).AddJwtBearer(bearer =>
        {
            bearer.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidIssuer = jwt["Issuer"],
                ValidAudience = jwt["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!))
            };
        });
    }

    public void AddCors()
    {
        _service.AddCors(options =>
        {
            options.AddPolicy("dev", op => op.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            options.AddPolicy("prod", op => op.WithOrigins("https://localhost:4200").AllowAnyHeader().AllowAnyMethod());
        });
    }
}