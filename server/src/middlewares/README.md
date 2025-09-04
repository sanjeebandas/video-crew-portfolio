# Rate Limiting Middleware

## Overview
This middleware provides IP-based rate limiting for login attempts to prevent brute force attacks on the admin authentication system.

## How It Works

### Configuration
- **Maximum Attempts**: 5 failed login attempts
- **Block Duration**: 1 hour after reaching the limit
- **Cleanup Interval**: Automatic cleanup every 10 minutes
- **Entry Expiry**: Entries are removed after 2 hours of inactivity

### Flow
1. **First Request**: IP is tracked with 0 attempts
2. **Failed Login**: Attempt counter increments
3. **5th Failed Attempt**: IP is blocked for 1 hour
4. **Successful Login**: Attempt counter resets to 0
5. **After Block Expiry**: IP can attempt login again

### IP Detection
The middleware detects client IP from multiple sources:
- `x-forwarded-for` header (for proxy/load balancer setups)
- `x-real-ip` header
- Direct connection IP
- Fallback to "unknown" if detection fails

## Usage

### Basic Implementation
```typescript
import { checkLoginRateLimit } from '../middlewares/rateLimiter';

// Apply to login route
router.post('/login', checkLoginRateLimit, loginController);
```

### Manual Control
```typescript
import { 
  recordFailedLogin, 
  resetLoginAttempts,
  getLoginAttempts 
} from '../middlewares/rateLimiter';

// Record failed attempt
recordFailedLogin(req);

// Reset on success
resetLoginAttempts(req);

// Check current status
const attempts = getLoginAttempts(req);
```

## API Endpoints

### Debug Endpoint (Remove in Production)
```
GET /api/auth/rate-limit-status
```
Returns current rate limit status for the requesting IP.

## Logging
The middleware provides detailed console logging:
- 🛡️ Initialization messages
- ⚠️ Failed login attempts
- 🚨 Warning before blocking
- 🚫 IP blocking notifications
- ✅ Successful reset messages
- 🧹 Cleanup operations

## Security Features
- **IP-based tracking**: Prevents attacks from single source
- **Automatic cleanup**: Prevents memory leaks
- **Progressive blocking**: Immediate response to threats
- **Reset on success**: Allows legitimate users to continue

## Production Considerations
1. Remove debug endpoint (`/rate-limit-status`)
2. Consider Redis for distributed deployments
3. Monitor logs for unusual activity patterns
4. Adjust limits based on traffic patterns
