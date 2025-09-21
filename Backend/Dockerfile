# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY Backend.sln .
COPY Backend/Shopy.WebApi/*.csproj ./Backend/Shopy.WebApi/

# Restore dependencies
RUN dotnet restore Backend.sln

# Copy all source code
COPY Backend/Shopy.WebApi/ ./Backend/Shopy.WebApi/

# Publish
WORKDIR /src/Backend/ShopZen.WebApi
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Entry point
ENTRYPOINT ["dotnet", "Backend.dll"]