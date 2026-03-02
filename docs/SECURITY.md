# 🔒 Security Implementation Guide

## Overview

This DataPilot AI application has been hardened following **OWASP Top 10** security best practices. All security measures are production-ready and thoroughly documented.

---

## 🛡️ Security Features Implemented

### 1. Rate Limiting (OWASP A04:2021 - Insecure Design)

**Implementation:** `server/middleware/rateLimiter.js`

**Protection against:** DDoS attacks, brute force, API abuse

**Limits Applied:**

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| General API | 100 req | 15 min | Prevent general abuse |
| AI Analysis (`/api/chat/analyze`) | 10 req | 10 min | Protect expensive operations |
| Chat Messages (`/api/chat/message`) | 30 req | 5 min | Prevent spam |
| All Routes (speed limiter) | 50 req | 15 min | Progressive slow-down |

**Response on Rate Limit:**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

**Configuration:**
- IP-based tracking
- Graceful HTTP 429 responses
- `RateLimit-*` headers included
- Customizable limits via environment variables

**OWASP Reference:** Prevents automated attacks and resource exhaustion

---

### 2. Input Validation & Sanitization (OWASP A03:2021 - Injection)

**Implementation:** `server/middleware/validator.js`

**Protection against:** XSS, injection attacks, malformed data

**Validation Rules:**

#### Prompt Validation (`/api/chat/analyze`)
```javascript
- Required: Yes
- Type: String
- Length: 3-500 characters
- Pattern: Alphanumeric + common punctuation only
- Sanitization: Trim, remove multiple spaces
- Rejects: HTML tags, script tags, SQL keywords
```

#### Message Validation (`/api/chat/message`)
```javascript
- Required: Yes
- Type: String  
- Length: 1-1000 characters
- Sanitization: HTML entity encoding
- Escapes: < > " ' / &
```

**Field Whitelisting:**
- `/api/chat/analyze`: Only accepts `prompt` field
- `/api/chat/message`: Only accepts `message` field
- Rejects unexpected fields with HTTP 400

**Content-Type Enforcement:**
- Only `application/json` accepted for POST/PUT/PATCH
- Returns HTTP 415 for invalid Content-Type

**OWASP Reference:** Prevents injection attacks by validating all inputs

---

### 3. Secure API Key Handling (OWASP A07:2021 - Auth Failures)

**Implementation:** `server/services/AIService.js`, `server/middleware/security.js`, `.env`

**Security Measures:**

✅ **Environment Variables**
- All API keys stored in `.env` file (never in code)
- `.env` added to `.gitignore` (never committed)
- `.env.example` provided as template (no real keys)

✅ **Key Validation on Startup**
```javascript
// Validates OpenAI key exists and has correct format
validateAPIKey() {
  if (!apiKey || apiKey === 'placeholder') {
    throw new Error('Invalid API key');
  }
  if (!apiKey.startsWith('sk-')) {
    console.warn('Key format may be invalid');
  }
}
```

✅ **No Client-Side Exposure**
- API keys only on server
- Never sent in responses
- Sanitized from error messages

✅ **Optional API Key Authentication**
```env
REQUIRE_API_KEY=true
API_KEYS=key1,key2,key3
```

**Key Rotation Guide:**
1. Generate new key in OpenAI dashboard
2. Update `OPENAI_API_KEY` in `.env`
3. Restart server
4. Old key automatically invalidated

**OWASP Reference:** Prevents credential exposure and unauthorized access

---

### 4. Security Headers (OWASP A05:2021 - Security Misconfiguration)

**Implementation:** `server/middleware/security.js` (Helmet)

**Headers Applied:**

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Protection:**
- **CSP**: Prevents XSS by controlling resource loading
- **Frame-Options**: Prevents clickjacking
- **HSTS**: Enforces HTTPS (production)
- **No-Sniff**: Prevents MIME type confusion
- **XSS-Protection**: Browser-level XSS filter

**OWASP Reference:** Defense-in-depth security layering

---

### 5. XSS Prevention (OWASP A03:2021 - Injection)

**Implementation:** `xss-clean` middleware

**Sanitization Applied:**
- Removes script tags from inputs
- Encodes HTML entities
- Strips event handlers (`onclick`, etc.)
- Validates JSON payloads

**Example:**
```javascript
Input:  "<script>alert('xss')</script>"
Output: "&lt;script&gt;alert('xss')&lt;/script&gt;"
```

**OWASP Reference:** Prevents stored and reflected XSS attacks

---

### 6. NoSQL Injection Prevention (OWASP A03:2021 - Injection)

**Implementation:** `express-mongo-sanitize` middleware

**Protection:**
- Removes MongoDB operators (`$`, `.`)
- Sanitizes query parameters
- Prevents query manipulation

**Example Blocked:**
```json
{
  "prompt": { "$ne": null }  // ❌ Blocked
}
```

**OWASP Reference:** Prevents NoSQL injection even though we don't use MongoDB (future-proof)

---

### 7. HTTP Parameter Pollution Prevention

**Implementation:** `hpp` middleware

**Protection:**
- Prevents duplicate parameters
- Blocks array parameter attacks

**Example:**
```
?prompt=legitimate&prompt[$ne]=malicious  // ❌ Blocked
```

---

### 8. CORS Restrictions (OWASP A05:2021 - Security Misconfiguration)

**Implementation:** `server/middleware/security.js`

**Allowed Origins:**
```javascript
- http://localhost:3000 (dev frontend)
- http://localhost:5000 (dev backend)
- process.env.FRONTEND_URL (production)
```

**Configuration:**
```javascript
{
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}
```

**Protection:** Prevents unauthorized cross-origin requests

---

### 9. Request Size Limiting (OWASP A04:2021 - Insecure Design)

**Implementation:** Body size limits

**Limits:**
- JSON payloads: 100kb max
- URL-encoded: 100kb max
- Any request body: 100kb max

**Response:** HTTP 413 (Payload Too Large)

**Protection:** Prevents DoS via large payloads

---

### 10. Error Handling (OWASP A04:2021 - Insecure Design)

**Implementation:** Global error handler in `app.js`

**Security Features:**
- ✅ Never exposes stack traces in production
- ✅ Logs full errors server-side only
- ✅ Returns generic messages to clients
- ✅ Differentiates operational vs programming errors

**Example:**
```javascript
// Production Response
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}

// Development Response (includes stack trace)
```

**OWASP Reference:** Prevents information disclosure

---

### 11. Security Audit Logging

**Implementation:** `server/middleware/security.js`

**Logged Events:**
- All requests (method, path, IP, user-agent)
- Rate limit violations
- Validation failures
- Suspicious patterns (SQL keywords, path traversal, etc.)
- API key failures

**Suspicious Pattern Detection:**
```javascript
- HTML/Script tags: /<>/'"
- Path traversal: ../
- SQL injection: union select
- XSS: javascript:, eval(
```

---

## 📋 Security Checklist

### Pre-Production

- [ ] Set strong `OPENAI_API_KEY` in `.env`
- [ ] Enable `REQUIRE_API_KEY=true` for production
- [ ] Set `NODE_ENV=production`
- [ ] Configure `FRONTEND_URL` for production domain
- [ ] Review rate limit values for your traffic
- [ ] Enable HTTPS (use reverse proxy like Nginx)
- [ ] Set up logging to file/service (not just console)
- [ ] Configure firewall rules
- [ ] Set up monitoring/alerts for rate limit violations

### Ongoing

- [ ] Rotate API keys every 90 days
- [ ] Review security logs weekly
- [ ] Update dependencies monthly (`npm audit`)
- [ ] Monitor rate limit metrics
- [ ] Review OWASP Top 10 annually

---

## 🚨 Security Incident Response

### If API Key Compromised:

1. **Immediately revoke** old key in OpenAI dashboard
2. **Generate** new API key
3. **Update** `.env` file with new key
4. **Restart** server
5. **Review** logs for unauthorized usage
6. **Monitor** OpenAI usage for anomalies

### If Rate Limit Attacked:

1. Check logs for attacking IPs
2. Consider IP blocking at firewall level
3. Reduce rate limits temporarily
4. Enable `REQUIRE_API_KEY` if not already

### If SQL/NoSQL Injection Detected:

1. Review security logs for attack pattern
2. Verify sanitization middleware is working
3. Check for any data corruption
4. Update validation rules if needed

---

## 🔧 Testing Security

### Manual Testing

**Rate Limiting:**
```bash
# Send 11 requests quickly to AI endpoint
for i in {1..11}; do
  curl -X POST http://localhost:5000/api/chat/analyze \
    -H "Content-Type: application/json" \
    -d '{"prompt":"test"}' 
done
# 11th request should return 429
```

**Input Validation:**
```bash
# Try malicious input
curl -X POST http://localhost:5000/api/chat/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt":"<script>alert(1)</script>"}'
# Should return 400 validation error
```

**Unexpected Fields:**
```bash
# Try extra fields
curl -X POST http://localhost:5000/api/chat/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","malicious":"field"}'
# Should return 400 unexpected fields error
```

### Automated Testing

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Security scan (optional)
npm install -g snyk
snyk test
```

---

## 📚 References

### OWASP Resources
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Documentation
- [Helmet.js Docs](https://helmetjs.github.io/)
- [Express Rate Limit](https://express-rate-limit.mintlify.app/)
- [Express Validator](https://express-validator.github.io/)

---

## 💡 Best Practices

1. **Never commit `.env` files** - Use `.env.example` only
2. **Rotate keys regularly** - Every 90 days minimum
3. **Monitor logs** - Set up alerts for suspicious activity
4. **Keep dependencies updated** - Run `npm audit` weekly
5. **Use HTTPS in production** - Configure SSL/TLS certificates
6. **Implement API versioning** - `/api/v1/chat/analyze`
7. **Add authentication** - Consider JWT for user sessions
8. **Database security** - If adding DB, use parameterized queries
9. **Penetration testing** - Test annually with OWASP ZAP or similar
10. **Security headers testing** - Use [securityheaders.com](https://securityheaders.com)

---

## 🎯 Compliance

This implementation follows:
- ✅ OWASP Top 10 2021
- ✅ OWASP API Security Top 10
- ✅ CWE Top 25 Security Weaknesses
- ✅ NIST Cybersecurity Framework (basic controls)

---

**Last Updated:** February 28, 2026  
**Security Version:** 1.0  
**Maintained by:** Development Team
