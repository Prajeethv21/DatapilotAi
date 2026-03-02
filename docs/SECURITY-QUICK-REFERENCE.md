# 🔒 Security Quick Reference Card

## Rate Limits
```
General API:    100 req / 15 min
AI Analysis:     10 req / 10 min
Chat Messages:   30 req / 5 min
```

## Response Codes
```
200 - OK
400 - Bad Request (validation failed)
401 - Unauthorized (invalid API key)
413 - Payload Too Large (>100kb)
415 - Unsupported Media Type (not JSON)
429 - Too Many Requests (rate limited)
500 - Internal Error
```

## Environment Variables
```env
# Required
OPENAI_API_KEY=sk-xxxxx

# Optional
REQUIRE_API_KEY=false
API_KEYS=key1,key2
FRONTEND_URL=http://localhost:3000
NODE_ENV=production
```

## Testing Commands
```powershell
# Install dependencies
npm install

# Run security tests
.\test-security.ps1

# Check vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Security Middleware Stack
```
1. Helmet (security headers)
2. CORS (origin restrictions)
3. Body Limiter (payload size)
4. Body Parser (JSON parsing)
5. Mongo Sanitize (NoSQL injection)
6. XSS Clean (XSS prevention)
7. HPP (parameter pollution)
8. Content-Type Validator
9. API Key Validator
10. Audit Logger
11. General Rate Limiter
12. Speed Limiter
```

## Validation Rules
```
Prompt:  3-500 chars, alphanumeric + punctuation
Message: 1-1000 chars, HTML-encoded
Fields:  Whitelist only, reject unexpected
```

## Files Modified
```
✅ server/app.js
✅ server/routes/chatRoutes.js
✅ server/routes/dataRoutes.js
✅ server/services/AIService.js
✅ server/package.json
✅ server/.env
✅ .gitignore
✅ README.md
```

## Files Created
```
✅ server/middleware/rateLimiter.js
✅ server/middleware/validator.js
✅ server/middleware/security.js
✅ SECURITY.md
✅ SECURITY-CHANGELOG.md
✅ SECURITY-IMPLEMENTATION-SUMMARY.md
✅ test-security.ps1
```

## Pre-Production Checklist
```
□ npm install (security dependencies)
□ Set OPENAI_API_KEY in .env
□ Run npm audit
□ Run test-security.ps1
□ Set NODE_ENV=production
□ Configure FRONTEND_URL
□ Enable HTTPS
□ Review rate limits
□ Setup monitoring
□ Configure logging
```

## Incident Response
```
API Key Compromised:
1. Revoke in OpenAI dashboard
2. Generate new key
3. Update .env
4. Restart server
5. Review logs

Rate Limit Attack:
1. Check logs for IPs
2. Consider IP blocking
3. Reduce rate limits
4. Enable REQUIRE_API_KEY

Injection Attempt:
1. Review security logs
2. Verify sanitization works
3. Check for data corruption
4. Update validation rules
```

## Documentation Links
```
Full Guide:   SECURITY.md
Changes:      SECURITY-CHANGELOG.md
Summary:      SECURITY-IMPLEMENTATION-SUMMARY.md
Testing:      test-security.ps1
Main Docs:    README.md
```

## OWASP Compliance
```
✅ A01 - Broken Access Control
✅ A03 - Injection
✅ A04 - Insecure Design
✅ A05 - Security Misconfiguration
✅ A07 - Authentication Failures
```

## Support Commands
```powershell
# View logs
Get-Content server/logs/*.log -Tail 50

# Check API status
Invoke-WebRequest http://localhost:5000/api/health

# Test rate limiting
for($i=1;$i-le12;$i++){curl http://localhost:5000/api/chat/analyze -Method POST -Body '{"prompt":"test"}' -ContentType 'application/json'}
```

---
**Version:** 1.0.0 | **Date:** 2026-02-28
