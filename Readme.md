# Shopy — Full-Stack eCommerce App

> **Angular + ASP.NET Web API + Stripe + JWT + RBAC**

A production-ready eCommerce application built for portfolio demonstration.
Supports roles (User, StoreManager, Admin), cart, checkout, payments, and more.

## Structure

ShopZen/
├── backend/ → ASP.NET Core Web API
└── frontend/ → Angular 19+ App

## Setup

### Backend (ASP.NET)

```bash
cd backend/Shopy.WebApi
dotnet restore
dotnet run

API runs at: https://localhost:5000

## Frontend
cd frontend/shopzen-frontend
npm install
ng serve

App runs at: http://localhost:4200

# Tech Stack
Frontend: Angular 19, TypeScript, RxJS, Angular Material, Tailwind CSS, Ngrx
Backend: ASP.NET Core 9, Entity Framework Core, SQL Server, Microsoft Identity
Auth: JWT + Role-Based Access Control
Payments: Stripe Checkout
Deployment: Ready for Docker, Azure, Render, Vercel

