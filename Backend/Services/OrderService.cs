using System;
using Backend.Data;
using Backend.DTOs.Requests.Order;
using Backend.DTOs.Responses.Orders;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class OrderService(ICartService service, ApplicationDbContext dbContext) : IOrderService
{
    private readonly ICartService cartService = service;
    private readonly ApplicationDbContext context = dbContext;

    public async Task<OrderDto> AddOrderasync(string userId, CreateOrderRequest createOrderRequest)
    {
        var cartItems = await context.CartItems.Where(p => p.UserId == userId).Include(p => p.Product).ToListAsync();

        if (!cartItems.Any()) throw new InvalidOperationException("your Cart is empty!");

        decimal totalAmount = 0;

        var orderItems = new List<OrderItem>();

        foreach (var item in cartItems)
        {
            var product = item.Product;
            if (product.StockCount < item.Quantity) throw new InvalidOperationException("Invalid quantity.");

            product.StockCount -= item.Quantity;

            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            };

            orderItems.Add(orderItem);
            totalAmount += orderItem.UnitPrice * orderItem.Quantity;
        }

        var orderNumber = $"ORD-{DateTime.UtcNow}-{Guid.NewGuid().ToString("N").Substring(0, 6)}";

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            OrderItems = orderItems,
            TotalAmount = totalAmount
        };

        await context.Orders.AddAsync(order);
        await context.SaveChangesAsync();

        await cartService.ClearCartAsync(userId);
        return await BuildOrderDtoAsync(order.Id);
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await context.Orders.OrderByDescending(o => o.OrderDate).ToListAsync();

        var orderDtos = new List<OrderDto>();

        foreach (var orderItem in orders)
        {
            var item = await BuildOrderDtoAsync(orderItem.Id);
            orderDtos.Add(item);
        }
        return orderDtos;
    }

    public async Task<OrderDto> GetOrderByAsync(string userId, int orderId)
    {
        var order = await context.Orders.Include(o => o.OrderItems).ThenInclude(o => o.Product).FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);
        if (order is null) throw new KeyNotFoundException("Order not found");
        return await BuildOrderDtoAsync(order.Id);
    }

    public async Task<OrderDto> GetOrderByIdAdminAsync(int orderId)
    {
        var order = await context.Orders.Include(o => o.OrderItems).ThenInclude(o => o.Product).FirstOrDefaultAsync(o => o.Id == orderId);
        if (order is null) throw new KeyNotFoundException("Order not found");
        return await BuildOrderDtoAsync(order.Id);
    }

    public async Task<List<OrderDto>> GetOrders(string userId)
    {
        var orders = await context.Orders.
        Where(e => e.UserId == userId).OrderByDescending(o => o.OrderDate).ToListAsync();

        var orderDtos = new List<OrderDto>();

        foreach (var orderItem in orders)
        {
            var item = await BuildOrderDtoAsync(orderItem.Id);
            orderDtos.Add(item);
        }
        return orderDtos;
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(string userId, UpdateOrderRequest updateOrderRequest)
    {
        var order = await context.Orders.FirstOrDefaultAsync(o => o.Id == updateOrderRequest.OrderId);

        if (order is null) throw new KeyNotFoundException("order not found exception");

        var validStatus = new[] { "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled" };

        if (!validStatus.Contains(updateOrderRequest.Status, StringComparer.OrdinalIgnoreCase)) throw new InvalidOperationException("Invalid order status");

        if (!string.IsNullOrEmpty(updateOrderRequest.Status))
        {
            order.Status = updateOrderRequest.Status;
            order.UpdatedBy = userId;
            order.UpdatedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();

        return await BuildOrderDtoAsync(order.Id);

    }

    private async Task<OrderDto> BuildOrderDtoAsync(int orderId)
    {
        var order = await context.Orders.Include(o => o.OrderItems).ThenInclude(p => p.Product).FirstAsync(o => o.Id == orderId);

        if (order is null) throw new KeyNotFoundException("order not found");

        var orderDto = new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            OrderNumber = $"ORD-{order.OrderDate:yyyy-mm-dd}-{order.Id:D6}",
            PaymentId = order.PaymentId,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(
                e => new OrderItemdto
                {
                    ProductId = e.ProductId,
                    ProductImageUrl = e.Product?.ImageUrl?.FirstOrDefault(),
                    ProductName = e.Product?.Name ?? "Unknown product",
                    Quantity = e.Quantity,
                    UnitPrice = e.UnitPrice
                }).ToList(),
        };

        return orderDto;
    }
}
