FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY *.sln .
COPY BackendAPI/*.csproj ./BackendAPI/
RUN dotnet restore

# Copy everything else
COPY . .
WORKDIR /src/BackendAPI

# Build and publish
RUN dotnet publish -c Release -o /app

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "BackendAPI.dll"]
