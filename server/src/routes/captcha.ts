import express from "express";
import { generateCaptcha, verifyCaptcha, getCaptchaStatus } from "../controllers/captcha.controller";

const router = express.Router();

// Generate new CAPTCHA
router.get("/generate", generateCaptcha);

// Verify CAPTCHA
router.post("/verify", verifyCaptcha);

// Get CAPTCHA status (for debugging)
router.get("/status", getCaptchaStatus);

export default router;
