FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY backend/ShopZen.WebApi/*.csproj ./backend/ShopZen.WebApi/
RUN dotnet restore backend/ShopZen.WebApi/ShopZen.WebApi.csproj

# Copy everything else
# Backend/Backend.csproj
COPY Backend/ShopZen.WebApi/ ./backend/ShopZen.WebApi/
WORKDIR /src/backend/ShopZen.WebApi
RUN dotnet publish -c Release -o /app/publish

# Final stage: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Render uses 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ShopZen.WebApi.dll"]