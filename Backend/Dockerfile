# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file
COPY *.csproj .
RUN dotnet restore

# Copy all source code
COPY . .

# Publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Entry point - use the correct DLL name (Backend.dll based on your project name)
ENTRYPOINT ["dotnet", "Backend.dll"]