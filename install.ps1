# DataPilot AI - One-Click Install Script
# Run this from the project root directory

Write-Host "🌌 DataPilot AI - Installation Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js 16+ first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Install root dependencies
Write-Host ""
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install server dependencies
Write-Host ""
Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install

# Check for .env file
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠️  Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file - PLEASE ADD YOUR OPENAI API KEY!" -ForegroundColor Green
    Write-Host "   Edit: server\.env" -ForegroundColor Cyan
    Write-Host "   Get key from: https://platform.openai.com/api-keys" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Set-Location ..

# Install client dependencies
Write-Host ""
Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Add your OpenAI API key to: server\.env" -ForegroundColor White
Write-Host "   2. Run the app: npm run dev" -ForegroundColor White
Write-Host "   3. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For detailed documentation, see README.md" -ForegroundColor Gray
Write-Host ""
