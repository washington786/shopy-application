using Backend.Services;
using Backend.Services.Interfaces;
using BackendAPI.Utils;
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

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// custom dependency helper
var dependencyUtilHelper = new DependencyHelper(builder.Configuration, builder.Services);

dependencyUtilHelper.SwaggerConfig();
dependencyUtilHelper.DbConnectionCtx();
dependencyUtilHelper.IdentityAdding();
dependencyUtilHelper.AddCors();
dependencyUtilHelper.AddAuthentication();

var app = builder.Build();

// cors
app.UseCors(app.Environment.IsDevelopment() ? "dev" : "prod");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();