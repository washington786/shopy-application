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

    public async Task<int> ConfirmPayment(string sessionId, string UserId)
    {
        var service = new SessionService();
        var session = await service.GetAsync(sessionId);

        if (session is null)
            throw new InvalidOperationException("Payment session not found.");

        Console.WriteLine($"SessionId: {sessionId}, PaymentStatus: {session.PaymentStatus}");

        using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {

            if (session.PaymentStatus?.ToLower() != "paid")
            {
                return -1;
            }

            var ttAmount = ((decimal)session.AmountTotal!) / 100;

            if (!session.Metadata.ContainsKey("orderId") == true || !int.TryParse(session.Metadata["orderId"], out int existingOrderId))
            {
                throw new InvalidOperationException("order id invalid");
            }

            var existingOrder = await dbContext.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(e => e.Id == existingOrderId);

            if (existingOrder is null) throw new KeyNotFoundException($"Order with Id {existingOrderId} not found");

            // If paid, create the order in DB
            // var order = new Order
            // {
            //     UserId = UserId,
            //     TotalAmount = ttAmount,
            //     Status = "Paid",
            //     OrderDate = DateTime.UtcNow,
            //     UpdatedAt = DateTime.UtcNow,
            //     UpdatedBy = "Stripe Payment",

            // };

            existingOrder.Status = "Paid";
            existingOrder.UpdatedAt = DateTime.UtcNow;
            existingOrder.UpdatedBy = "Stripe Payment";

            // await dbContext.Orders.AddAsync(order);
            // await dbContext.SaveChangesAsync();

            var existingPayment = await dbContext.Payments.FirstOrDefaultAsync(p => p.SessionId == session.Id);

            // payment
            if (existingPayment is null)
            {
                var payment = new Payment
                {
                    Amount = ttAmount,
                    CreatedAt = DateTime.UtcNow,
                    OrderId = existingOrder.Id,
                    Provider = "Stripe",
                    SessionId = session.Id,
                    TransactionId = session.PaymentIntentId,
                    Status = "Completed"
                };
                await dbContext.Payments.AddAsync(payment);

                existingOrder.PaymentId = payment.Id;
            }
            else
            {
                existingPayment.Status = "Completed";
                existingPayment.Amount = ttAmount;
                existingPayment.TransactionId = session.PaymentIntentId;
                existingOrder.PaymentId = existingPayment.Id;
            }

            await dbContext.SaveChangesAsync();


            Console.WriteLine($"Order {existingOrder.Id} updated to Paid status with {existingOrder.OrderItems?.Count ?? 0} items");

            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return existingOrder.Id;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
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
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = stripeItems,
            Mode = "payment",
            SuccessUrl = configuration["Stripe:SuccessUrl"] + "?session_id={CHECKOUT_SESSION_ID}&orderId=" + order.Id,
            CancelUrl = configuration["Stripe:CancelUrl"],
            ClientReferenceId = userId,
            Metadata = new Dictionary<string, string>
            {
                {"orderId", order.Id.ToString()},
                {"userId", userId}
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
