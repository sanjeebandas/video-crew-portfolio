import express from "express";
import { loginAdmin, validateToken } from "../controllers/authController";
import { authenticateToken } from "../middlewares/auth.middleware";
import { checkLoginRateLimit, getLoginAttempts, getRemainingLoginAttempts, getBlockedUntil, isCurrentlyBlocked } from "../middlewares/rateLimiter";

const router = express.Router();

router.post("/login", checkLoginRateLimit, loginAdmin);
router.get("/validate", authenticateToken, validateToken);

// Debug endpoint to check rate limit status (remove in production)
router.get("/rate-limit-status", (req, res) => {
  const attempts = getLoginAttempts(req);
  const remaining = getRemainingLoginAttempts(req);
  const blockedUntil = getBlockedUntil(req);
  const isBlocked = isCurrentlyBlocked(req);
  
  res.json({
    attempts,
    remaining,
    maxAttempts: 5,
    blockedUntil,
    isBlocked,
    message: `Current attempts: ${attempts}, Remaining: ${remaining}, Blocked: ${isBlocked}`
  });
});

export default router;
