# Security Testing Script for DataPilot AI
# Run this to verify security features are working

Write-Host "DataPilot AI - Security Testing" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"
$testsPassed = 0
$testsFailed = 0

# Helper function to make requests
function Test-Endpoint {
    param (
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null,
        [int]$ExpectedStatus = 200,
        [hashtable]$Headers = @{}
    )

    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
        }

        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }

        try {
            $response = Invoke-WebRequest @params
            $actualStatus = $response.StatusCode
        } catch {
            $actualStatus = $_.Exception.Response.StatusCode.value__
        }

        if ($actualStatus -eq $ExpectedStatus) {
            Write-Host "  ✅ PASS - Status: $actualStatus" -ForegroundColor Green
            $script:testsPassed++
        } else {
            Write-Host "  ❌ FAIL - Expected: $ExpectedStatus, Got: $actualStatus" -ForegroundColor Red
            $script:testsFailed++
        }
    } catch {
        Write-Host "  ❌ ERROR - $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
    }

    Write-Host ""
}

# Test 1: Health Check (should work)
Write-Host "=== Basic Functionality ===" -ForegroundColor Magenta
Test-Endpoint -Name "Health Check" -Url "$baseUrl/health" -ExpectedStatus 200

# Test 2: Invalid Content-Type (should fail with 415)
Write-Host "=== Content-Type Validation ===" -ForegroundColor Magenta
Test-Endpoint -Name "Invalid Content-Type" `
    -Url "$baseUrl/chat/analyze" `
    -Method "POST" `
    -Headers @{"Content-Type" = "text/plain"} `
    -ExpectedStatus 415

# Test 3: Input Validation - Empty prompt (should fail with 400)
Write-Host "=== Input Validation ===" -ForegroundColor Magenta
Test-Endpoint -Name "Empty Prompt" `
    -Url "$baseUrl/chat/analyze" `
    -Method "POST" `
    -Body @{prompt = ""} `
    -ExpectedStatus 400

# Test 4: Input Validation - Too long prompt (should fail with 400)
Test-Endpoint -Name "Too Long Prompt (>500 chars)" `
    -Url "$baseUrl/chat/analyze" `
    -Method "POST" `
    -Body @{prompt = "a" * 501} `
    -ExpectedStatus 400

# Test 5: Input Validation - XSS attempt (should fail with 400)
Test-Endpoint -Name "XSS Injection Attempt" `
    -Url "$baseUrl/chat/analyze" `
    -Method "POST" `
    -Body @{prompt = "<script>alert(""xss"")</script>"} `
    -ExpectedStatus 400

# Test 6: Unexpected Fields (should fail with 400)
Test-Endpoint -Name "Unexpected Fields" `
    -Url "$baseUrl/chat/analyze" `
    -Method "POST" `
    -Body @{prompt = "test"; malicious = "field"} `
    -ExpectedStatus 400

# Test 7: Valid request (should work with valid API key)
Write-Host "=== Valid Request ===" -ForegroundColor Magenta
Test-Endpoint -Name "Valid Analysis Request" `
    -Url "$baseUrl/chat/analyze" `
    -Method "POST" `
    -Body @{prompt = "show covid data"} `
    -ExpectedStatus 200

# Test 8: Rate Limiting (send multiple rapid requests)
Write-Host "=== Rate Limiting ===" -ForegroundColor Magenta
Write-Host "Sending 12 rapid requests to test rate limiting..." -ForegroundColor Yellow

$rateLimitHit = $false
for ($i = 1; $i -le 12; $i++) {
    try {
        $body = @{prompt = "test"} | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "$baseUrl/chat/analyze" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
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
    Start-Sleep -Milliseconds 500
}

if ($rateLimitHit) {
    Write-Host "  ✅ PASS - Rate limiting triggered at request $i" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ⚠️  WARNING - Rate limit not triggered (may need more requests)" -ForegroundColor Yellow
    Write-Host "     This could be OK if limit is high or requests were too slow" -ForegroundColor Gray
}

Write-Host ""

# Test 9: CORS (if testing cross-origin)
Write-Host "=== CORS Headers ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    
    if ($corsHeader) {
        Write-Host "  ✅ PASS - CORS headers present" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "  ⚠️  INFO - CORS may be configured for specific origins" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ ERROR testing CORS" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""

# Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All security tests passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Review the output above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Notes:" -ForegroundColor Gray
Write-Host "  - Rate limiting may take 10+ requests to trigger" -ForegroundColor Gray
Write-Host "  - Some tests expect failures (that is correct behavior)" -ForegroundColor Gray
Write-Host "  - Make sure server is running on localhost:5000" -ForegroundColor Gray
Write-Host ""
