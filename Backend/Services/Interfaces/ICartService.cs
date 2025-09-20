using System;
using Backend.DTOs.Requests.Cart;
using Backend.DTOs.Responses.Cart;

namespace Backend.Services.Interfaces;

public interface ICartService
{
    Task<CartItemDto> AddToCartAsync(string userId, AddToCartRequest addToCartRequest);
    Task<CartItemDto> UpdateCartAsync(string userId, int cartItemId, UpdateCartRequest updateCartRequest);
    Task<IEnumerable<CartItemDto>> GetCartAsync(string userId);
    Task<bool> RemoveFromCartAsync(string userId, int cartItemId);
    Task<bool> ClearCartAsync(string userId);
}
