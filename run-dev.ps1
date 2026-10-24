# FoodieFriends Development Runner
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   🍽️  FoodieFriends Development Environment  " -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "src\FoodieFriends.Api"
$frontendPath = Join-Path $PSScriptRoot "src\FoodieFriends.Web"

Write-Host "`n[1/2] Starting ASP.NET Core Web API on http://localhost:5000..." -ForegroundColor Green
$backendProc = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; dotnet run" -PassThru

Write-Host "`n[2/2] Starting React Vite Frontend on http://localhost:5173..." -ForegroundColor Green
$frontendProc = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -PassThru

Write-Host "`n✨ Both services launched in separate windows!" -ForegroundColor Cyan
Write-Host "➡️ Web UI: http://localhost:5173" -ForegroundColor Yellow
Write-Host "➡️ API:    http://localhost:5000/api/locations/countries" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C or close the opened terminal windows to stop."
