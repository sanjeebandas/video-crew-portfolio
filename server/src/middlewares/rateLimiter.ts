import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  attempts: number;
  blockedUntil: Date | null;
  lastAttempt: Date;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds
  private readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // Clean up every 10 minutes

  constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
    console.log("🛡️ Rate limiter initialized - Max attempts:", this.MAX_ATTEMPTS, "Block duration:", this.BLOCK_DURATION / 1000 / 60, "minutes");
  }

  private getClientIP(req: Request): string {
    // Get IP from various sources (proxy, load balancer, etc.)
    return (
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "unknown"
    ) as string;
  }

  private isBlocked(entry: RateLimitEntry): boolean {
    if (!entry.blockedUntil) return false;
    return new Date() < entry.blockedUntil;
  }

  private cleanup(): void {
    const now = new Date();
    let cleanedCount = 0;
    for (const [ip, entry] of this.attempts.entries()) {
      // Remove entries older than 2 hours
      if (now.getTime() - entry.lastAttempt.getTime() > 2 * 60 * 60 * 1000) {
        this.attempts.delete(ip);
        cleanedCount++;
      }
    }
    if (cleanedCount > 0) {
      console.log(`🧹 Rate limiter cleanup: Removed ${cleanedCount} expired entries`);
    }
  }

  public checkRateLimit(req: Request, res: Response, next: NextFunction): void {
    const clientIP = this.getClientIP(req);
    const now = new Date();
    
    // Get or create entry for this IP
    let entry = this.attempts.get(clientIP);
    if (!entry) {
      entry = {
        attempts: 0,
        blockedUntil: null,
        lastAttempt: now
      };
      this.attempts.set(clientIP, entry);
    }

    // Check if IP is currently blocked
    if (this.isBlocked(entry)) {
      const remainingTime = Math.ceil((entry.blockedUntil!.getTime() - now.getTime()) / 1000 / 60);
      const remainingSeconds = Math.ceil((entry.blockedUntil!.getTime() - now.getTime()) / 1000);
      console.log(`🚫 Rate limit blocked IP ${clientIP} - ${remainingTime} minutes (${remainingSeconds} seconds) remaining`);
      res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${remainingTime} minutes.`,
        blockedUntil: entry.blockedUntil
      });
      return;
    }

    // Check if block has expired and reset attempts
    if (entry.blockedUntil && entry.attempts >= this.MAX_ATTEMPTS && now >= entry.blockedUntil) {
      console.log(`⏰ Block expired for IP ${clientIP}, resetting attempts from ${entry.attempts} to 0`);
      this.attempts.delete(clientIP);
      entry = {
        attempts: 0,
        blockedUntil: null,
        lastAttempt: now
      };
      this.attempts.set(clientIP, entry);
    }

    // Check if IP should be blocked
    if (entry.attempts >= this.MAX_ATTEMPTS) {
      entry.blockedUntil = new Date(now.getTime() + this.BLOCK_DURATION);
      this.attempts.set(clientIP, entry);
      
      console.log(`🚫 Rate limit blocked IP ${clientIP} for 2 minutes after ${this.MAX_ATTEMPTS} failed attempts`);
      console.log(`⏰ Block expires at: ${entry.blockedUntil.toLocaleTimeString()}`);
      res.status(429).json({
        success: false,
        message: `Too many failed attempts. Account blocked for 2 minutes.`,
        blockedUntil: entry.blockedUntil
      });
      return;
    }

    // Allow request to proceed
    next();
  }

  public recordFailedAttempt(req: Request): void {
    const clientIP = this.getClientIP(req);
    const entry = this.attempts.get(clientIP);
    
    if (entry) {
      entry.attempts += 1;
      entry.lastAttempt = new Date();
      this.attempts.set(clientIP, entry);
      
      console.log(`⚠️ Failed login attempt from IP ${clientIP} - Attempt ${entry.attempts}/${this.MAX_ATTEMPTS}`);
      
      if (entry.attempts === this.MAX_ATTEMPTS - 1) {
        console.log(`🚨 IP ${clientIP} is about to be blocked on next failed attempt`);
      }
    }
  }

  public resetAttempts(req: Request): void {
    const clientIP = this.getClientIP(req);
    const entry = this.attempts.get(clientIP);
    
    if (entry && entry.attempts > 0) {
      console.log(`✅ Reset rate limit for IP ${clientIP} - Previous attempts: ${entry.attempts}`);
      this.attempts.delete(clientIP);
    }
  }

  public getAttempts(req: Request): number {
    const clientIP = this.getClientIP(req);
    const entry = this.attempts.get(clientIP);
    if (!entry) return 0;
    
    // Check if block has expired and reset attempts
    if (entry.blockedUntil && entry.attempts >= this.MAX_ATTEMPTS && new Date() >= entry.blockedUntil) {
      console.log(`⏰ Block expired for IP ${clientIP}, resetting attempts from ${entry.attempts} to 0`);
      this.attempts.delete(clientIP);
      return 0;
    }
    
    return entry.attempts;
  }

  public getRemainingAttempts(req: Request): number {
    const clientIP = this.getClientIP(req);
    const entry = this.attempts.get(clientIP);
    if (!entry) return this.MAX_ATTEMPTS;
    
    // Check if block has expired and reset attempts
    if (entry.blockedUntil && entry.attempts >= this.MAX_ATTEMPTS && new Date() >= entry.blockedUntil) {
      console.log(`⏰ Block expired for IP ${clientIP}, resetting attempts from ${entry.attempts} to 0`);
      this.attempts.delete(clientIP);
      return this.MAX_ATTEMPTS;
    }
    
    return Math.max(0, this.MAX_ATTEMPTS - entry.attempts);
  }

  public getBlockedUntil(req: Request): Date | null {
    const clientIP = this.getClientIP(req);
    const entry = this.attempts.get(clientIP);
    if (!entry) return null;
    
    // Check if block has expired and reset attempts
    if (entry.blockedUntil && entry.attempts >= this.MAX_ATTEMPTS && new Date() >= entry.blockedUntil) {
      console.log(`⏰ Block expired for IP ${clientIP}, resetting attempts from ${entry.attempts} to 0`);
      this.attempts.delete(clientIP);
      return null;
    }
    
    return entry.blockedUntil;
  }

  public isCurrentlyBlocked(req: Request): boolean {
    const clientIP = this.getClientIP(req);
    const entry = this.attempts.get(clientIP);
    if (!entry) return false;
    
    // Check if block has expired and reset attempts
    if (entry.blockedUntil && entry.attempts >= this.MAX_ATTEMPTS && new Date() >= entry.blockedUntil) {
      console.log(`⏰ Block expired for IP ${clientIP}, resetting attempts from ${entry.attempts} to 0`);
      this.attempts.delete(clientIP);
      return false;
    }
    
    return this.isBlocked(entry);
  }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Export middleware functions
export const checkLoginRateLimit = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter.checkRateLimit(req, res, next);
};

export const recordFailedLogin = (req: Request) => {
  rateLimiter.recordFailedAttempt(req);
};

export const resetLoginAttempts = (req: Request) => {
  rateLimiter.resetAttempts(req);
};

export const getLoginAttempts = (req: Request) => {
  return rateLimiter.getAttempts(req);
};

export const getRemainingLoginAttempts = (req: Request) => {
  return rateLimiter.getRemainingAttempts(req);
};

export const getBlockedUntil = (req: Request) => {
  return rateLimiter.getBlockedUntil(req);
};

export const isCurrentlyBlocked = (req: Request) => {
  return rateLimiter.isCurrentlyBlocked(req);
};
