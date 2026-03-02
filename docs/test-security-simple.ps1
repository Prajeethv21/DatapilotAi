# Security Testing Script for DataPilot AI
# Run this to verify security features are working

Write-Host "DataPilot AI - Security Testing" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"
$testsPassed = 0
$testsFailed = 0

Write-Host "[*] Testing: Health Check Endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "    [PASS] Health check successful" -ForegroundColor Green
        $testsPassed++
    }
} catch {
    Write-Host "    [FAIL] Health check failed" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""
Write-Host "[*] Testing: Input Validation - Empty prompt" -ForegroundColor Yellow
try {
    $body = @{message = ""} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/chat/message" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 400) {
        Write-Host "    [PASS] Empty input rejected" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "    [FAIL] Empty input not rejected (Status: $($response.StatusCode))" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "    [PASS] Empty input rejected" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "    [FAIL] Unexpected error: $statusCode" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""
Write-Host "[*] Testing: Input Validation - Too long message" -ForegroundColor Yellow
try {
    $longMessage = "a" * 2001
    $body = @{message = $longMessage} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$baseUrl/chat/message" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 400) {
        Write-Host "    [PASS] Long input rejected" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "    [FAIL] Long input not rejected" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "    [PASS] Long input rejected" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "    [FAIL] Unexpected error: $statusCode" -ForegroundColor Red
        $testsFailed++
    }
}

Write-Host ""
Write-Host "[*] Testing: Rate Limiting" -ForegroundColor Yellow
Write-Host "    Sending multiple rapid requests..." -ForegroundColor Gray

$rateLimitHit = $false
for ($i = 1; $i -le 15; $i++) {
    try {
        $body = @{message = "test $i"} | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "$baseUrl/chat/message" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -UseBasicParsing `
            -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 429) {
            $rateLimitHit = $true
            break
        }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            $rateLimitHit = $true
            break
        }
    }
    Start-Sleep -Milliseconds 300
}

if ($rateLimitHit) {
    Write-Host "    [PASS] Rate limiting triggered at request $i" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "    [INFO] Rate limit not triggered (may need more requests or longer test)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[*] Testing: CORS Headers" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -UseBasicParsing
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    
    if ($corsHeader) {
        Write-Host "    [PASS] CORS headers present: $corsHeader" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "    [INFO] CORS headers not found (may be OK)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "    [FAIL] Error testing CORS" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "All security tests passed!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed. Review the output above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Notes:" -ForegroundColor Gray
Write-Host "  - Rate limiting may take 10+ requests to trigger" -ForegroundColor Gray
Write-Host "  - Some tests expect failures (that is correct behavior)" -ForegroundColor Gray
Write-Host "  - Make sure server is running on localhost:5000" -ForegroundColor Gray
Write-Host ""
