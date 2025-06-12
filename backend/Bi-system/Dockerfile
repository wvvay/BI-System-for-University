#Использование базового образа
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

#Сборка проекта
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Bi-system.Domain/Bi-system.Domain.csproj", "Bi-system.Domain/"]
COPY ["Bi-system.Application/Bi-system.Application.csproj", "Bi-system.Application/"]
COPY ["Bi-system.Infrastructure/Bi-system.Infrastructure.csproj", "Bi-system.Infrastructure/"]
COPY ["Bi-system.API/Bi-system.API.csproj", "Bi-system.API/"]
RUN dotnet restore "Bi-system.API/Bi-system.API.csproj"
COPY . .
WORKDIR /src/Bi-system.API 
RUN dotnet build "Bi-system.API.csproj" -c Release -o /app/build

#Публикация приложения
FROM build AS publish
RUN dotnet publish "Bi-system.API.csproj" -c Release -o /app/publish

#Запуск приложения
FROM base as final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Bi-system.API.dll"]
