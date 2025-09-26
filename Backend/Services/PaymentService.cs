using System;
using Backend.Data;
using Backend.DTOs.Responses.Checkout;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace Backend.Services;

public class PaymentService(ApplicationDbContext applicationDb, IOrderService orderService, IConfiguration configuration) : IPaymentService
{

    private readonly ApplicationDbContext dbContext = applicationDb;
    private readonly IOrderService orderService = orderService;
    private readonly IConfiguration configuration = configuration;

    public async Task<int> ConfirmPayment(string sessionId)
    {
        // StripeConfiguration.ApiKey = _stripeSecretKey;

        var sessionService = new SessionService();

        var session = await sessionService.GetAsync(sessionId);

        if (session.PaymentStatus != "Paid")
        {
            throw new InvalidOperationException("Sorry, order not completed(paid).");
        }

        if (!session.Metadata.TryGetValue("OrderId", out string orderIdStr) || !long.TryParse(orderIdStr, out long orderId))
        {
            throw new KeyNotFoundException("Invalid order id");
        }

        var order = await dbContext.Orders.FindAsync(orderId);

        if (order is null || order.Status != "Pending") throw new InvalidOperationException("Invalid Order");

        order.UpdatedAt = DateTime.UtcNow;
        order.Status = "Paid";

        var payment = await dbContext.Payments.FirstOrDefaultAsync(p => p.SessionId == sessionId);

        if (payment is not null)
        {
            payment.Status = "Successful";
        }

        await dbContext.SaveChangesAsync();

        var cartItems = dbContext.CartItems.Where(i => i.UserId == order.UserId);

        dbContext.CartItems.RemoveRange(cartItems);

        await dbContext.SaveChangesAsync();

        return order.Id;
    }

    public async Task<CheckoutSessionResponse> CreateCheckOut(string userId)
    {
        var cartItems = await dbContext.CartItems.Where(d => d.UserId == userId).Include(o => o.Product).ToListAsync();

        if (cartItems.Count == 0) throw new KeyNotFoundException("Cart is empty");

        var order = await orderService.AddOrderasync(userId, new());

        var stripeItems = cartItems.Select(cartitem => new SessionLineItemOptions
        {
            PriceData = new SessionLineItemPriceDataOptions
            {
                Currency = "ZAR",
                UnitAmount = (long)(cartitem.Product.Price * 100),
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = cartitem.Product.Name,
                    Description = cartitem.Product.Description,
                    Images = cartitem?.Product?.ImageUrl?.Take(1).ToList(),
                }
            },
            Quantity = cartitem?.Quantity
        }).ToList();

        // stripe checkout session
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = ["Card"],
            LineItems = stripeItems,
            Mode = "payment",
            SuccessUrl = configuration["Stripe:SuccessUrl"] + "?session_id={CHECKOUT_SESSION_ID}&orderId=" + order.Id,
            CancelUrl = configuration["Stripe:CancelUrl"],
            Metadata = new Dictionary<string, string>
            {
                {"orderId",order.Id.ToString()},
            {"userId",userId}
            }
        };

        // create session
        var service = new SessionService();
        var session = await service.CreateAsync(options);

        // payment status
        var payment = new Payment
        {
            OrderId = order.Id,
            Amount = order.TotalAmount,
            Provider = "Stripe",
            Status = "Pending",
            SessionId = session.Id,
            CreatedAt = DateTime.UtcNow
        };
        await dbContext.Payments.AddAsync(payment);
        await dbContext.SaveChangesAsync();

        // update order payment id
        order.PaymentId = payment.Id;
        await dbContext.SaveChangesAsync();

        return new CheckoutSessionResponse
        {
            OrderId = order.Id,
            SessionId = session.Id,
            SessionUrl = session.Url
        };
    }
}
