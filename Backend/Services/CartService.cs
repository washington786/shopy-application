using Backend.Data;
using Backend.DTOs.Requests.Cart;
using Backend.DTOs.Responses.Cart;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class CartService(ApplicationDbContext applicationDbContext) : ICartService
{
    private readonly ApplicationDbContext dbContext = applicationDbContext;

    public async Task<CartItemDto> AddToCartAsync(string userId, AddToCartRequest addToCartRequest)
    {
        var product = await dbContext.Products.FirstOrDefaultAsync(p => p.Id == addToCartRequest.ProductId && p.StockCount > 0);

        if (product is null) throw new InvalidOperationException("Product not found or out of stock");

        if (addToCartRequest.Quantity > product.StockCount) throw new InvalidOperationException($"Product has less stock left ({product.StockCount})");

        // item existing
        var exist = await dbContext.CartItems.FirstOrDefaultAsync(item => item.ProductId == addToCartRequest.ProductId && item.UserId == userId);

        if (exist is not null)
        {
            if (exist.Quantity + addToCartRequest.Quantity > product.StockCount) throw new InvalidOperationException($"Product has less stock left ({product.StockCount})");

            exist.Quantity += addToCartRequest.Quantity;
        }
        else
        {
            exist = new CartItem
            {
                ProductId = addToCartRequest.ProductId,
                Quantity = addToCartRequest.Quantity,
                UserId = userId
            };

            await dbContext.CartItems.AddAsync(exist);
        }

        await SaveChangesAsync();

        return GetCartItemDto(exist);
    }

    public async Task<bool> ClearCartAsync(string userId)
    {
        var cart = await dbContext.CartItems.Where(c => c.UserId == userId).ToListAsync();
        dbContext.CartItems.RemoveRange(cart);
        await SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<CartItemDto>> GetCartAsync(string userId)
    {
        var cartItems = await dbContext.
        CartItems.Where(item => item.UserId == userId).Include(p => p.Product).Select(item => GetCartItemDto(item)).ToListAsync();
        return cartItems;
    }

    public async Task<bool> RemoveFromCartAsync(string userId, int cartItemId)
    {
        var cart = await dbContext.CartItems.FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);

        if (cart is null) return false;

        dbContext.CartItems.Remove(cart);
        await SaveChangesAsync();

        return true;
    }

    public async Task<CartItemDto> UpdateCartAsync(string userId, int cartItemId, UpdateCartRequest updateCartRequest)
    {
        var cartItem = await dbContext.CartItems.Include(p => p.Product).FirstOrDefaultAsync(item => item.Id == cartItemId && item.UserId == userId);

        if (cartItem is null) throw new KeyNotFoundException("Sorry, cart item not found.");

        if (updateCartRequest.Quantity <= 0) throw new InvalidOperationException("quantity must be greater than 0.");

        if (updateCartRequest.Quantity > cartItem.Product.StockCount) throw new InvalidOperationException($"Invalid quantity. {cartItem.Product.StockCount} is available.");

        cartItem.Quantity = updateCartRequest.Quantity;
        await SaveChangesAsync();

        return GetCartItemDto(cartItem);
    }

    private static CartItemDto GetCartItemDto(CartItem cartItem)
    {
        return new CartItemDto
        {
            Id = cartItem.Id,
            ProductId = cartItem.ProductId,
            ProductImageUrl = cartItem.Product?.ImageUrl?.FirstOrDefault(),
            ProductName = cartItem?.Product?.Name,
            ProductPrice = cartItem.Product.Price,
            Quantity = cartItem.Quantity,
        };
    }

    private async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }
}
