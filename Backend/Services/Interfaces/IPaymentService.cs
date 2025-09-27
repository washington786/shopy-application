using System;
using Backend.DTOs.Responses.Checkout;

namespace Backend.Services.Interfaces;

public interface IPaymentService
{

    Task<CheckoutSessionResponse> CreateCheckOut(string userId);
    Task<int> ConfirmPayment(string sessionId, string UserId);
}
