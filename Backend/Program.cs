using Backend.Data;
using Backend.Services;
using Backend.Services.Interfaces;
using BackendAPI.Utils;
using Microsoft.EntityFrameworkCore;
using TaskManager.Services;

var builder = WebApplication.CreateBuilder(args);

// token(jWT)
builder.Services.AddScoped<TokenService>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IRoleService, RoleSeederService>();

builder.Services.AddControllers();

// swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHealthChecks();

// custom dependency helper
var dependencyUtilHelper = new DependencyHelper(builder.Configuration, builder.Services);

dependencyUtilHelper.SwaggerConfig();
dependencyUtilHelper.DbConnectionCtx();
dependencyUtilHelper.IdentityAdding();
dependencyUtilHelper.AddCors();
dependencyUtilHelper.AddAuthentication();

// port
var port = Environment.GetEnvironmentVariable("PORT") ?? "8000";
builder.WebHost.UseKestrel().UseUrls($"http://*:{port}");

var app = builder.Build();
// cors
app.UseCors(app.Environment.IsDevelopment() ? "dev" : "prod");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapHealthChecks("/health");
// seeding
using (var scope = app.Services.CreateScope())
{
    var roleSeeder = scope.ServiceProvider.GetRequiredService<IRoleService>();
    var dbCtxt = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await roleSeeder.CreateRoleSeeding();
    await dbCtxt.Database.MigrateAsync();
}

app.Run();