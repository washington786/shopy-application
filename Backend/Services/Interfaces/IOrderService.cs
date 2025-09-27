using System;
using Backend.DTOs.Requests.Order;
using Backend.DTOs.Responses.Orders;

namespace Backend.Services.Interfaces;

public interface IOrderService
{
    Task<OrderDto> AddOrderasync(string userId, CreateOrderRequest createOrderRequest);
    Task<List<OrderDto>> GetOrders(string userId);
    Task<OrderDto> GetOrderByAsync(string userId, int orderId);

    // Admin
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto> GetOrderByIdAdminAsync(int userId);

    // update order
    Task<OrderDto> UpdateOrderStatusAsync(string userId, UpdateOrderRequest updateOrderRequest);
}
