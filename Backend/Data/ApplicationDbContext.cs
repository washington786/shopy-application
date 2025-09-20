using System;
using Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Product.Price
        builder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        // Order.TotalAmount
        builder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        // OrderItem.UnitPrice
        builder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasPrecision(18, 2);

        // Payment.Amount
        builder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2);

        // mapping
        builder.Entity<Product>(entity =>
        {
            entity.
            HasOne(p => p.Category)
            .WithMany(p => p.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Order>(entity =>
        {
            entity.
            HasOne(p => p.User).
            WithMany(o => o.Orders).
            HasForeignKey(o => o.UserId).
            OnDelete(DeleteBehavior.Cascade);

            entity.
            HasOne(o => o.Payment).
            WithOne(o => o.Order).
            HasForeignKey<Order>(o => o.PaymentId).
            OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<CartItem>(entity =>
        {
            entity.HasOne(c => c.Users).WithMany(c => c.CartItems).HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Product).WithMany(c => c.CartItems).HasForeignKey(c => c.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Payment>(entity =>
        {
            entity.HasOne(p => p.Order).WithOne(p => p.Payment).HasForeignKey<Payment>(p => p.OrderId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<OrderItem>(entity =>
        {
            entity.HasOne(o => o.Order).WithMany(o => o.OrderItems).HasForeignKey(o => o.OrderId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(o => o.Product).WithMany(o => o.OrderItems).HasForeignKey(o => o.ProductId).OnDelete(DeleteBehavior.Restrict);
        });
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Payment> Payments { get; set; }


}
