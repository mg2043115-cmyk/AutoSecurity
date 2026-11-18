# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AutoSecurity.csproj", "./"]
RUN dotnet restore "AutoSecurity.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "AutoSecurity.csproj" -c Release -o /app/build

# Estágio de Publicação
FROM build AS publish
RUN dotnet publish "AutoSecurity.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Estágio Final / Execução
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AutoSecurity.dll"]
