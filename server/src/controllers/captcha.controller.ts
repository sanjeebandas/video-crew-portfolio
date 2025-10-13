import { Request, Response } from "express";
import svgCaptcha from "svg-captcha";

// In-memory store for CAPTCHA sessions (in production, use Redis or database)
const captchaSessions = new Map<string, { text: string; timestamp: number }>();

// Clean up expired sessions (older than 5 minutes)
const cleanupExpiredSessions = () => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  for (const [sessionId, session] of captchaSessions.entries()) {
    if (now - session.timestamp > fiveMinutes) {
      captchaSessions.delete(sessionId);
    }
  }
};

// Generate new CAPTCHA
export const generateCaptcha = async (req: Request, res: Response) => {
  try {
    // Clean up expired sessions
    cleanupExpiredSessions();
    
    // Generate unique session ID
    const sessionId = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    // Generate CAPTCHA
    const captcha = svgCaptcha.create({
      size: 4, // Number of characters
      ignoreChars: '0o1il', // Characters to avoid
      noise: 2, // Number of noise lines
      color: true, // Use colors
      background: '#f0f0f0', // Background color
      width: 120,
      height: 40,
      fontSize: 50,
      charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789' // Character set
    });
    
    // Store CAPTCHA text with session ID
    captchaSessions.set(sessionId, {
      text: captcha.text.toLowerCase(), // Store lowercase for case-insensitive comparison
      timestamp: Date.now()
    });
    
    res.status(200).json({
      sessionId,
      captchaSvg: captcha.data,
      expiresIn: 300000 // 5 minutes in milliseconds
    });
  } catch (error) {
    console.error('CAPTCHA generation error:', error);
    res.status(500).json({ 
      message: "Failed to generate CAPTCHA",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Verify CAPTCHA
export const verifyCaptcha = async (req: Request, res: Response) => {
  try {
    const { sessionId, userInput } = req.body;
    
    if (!sessionId || !userInput) {
      return res.status(400).json({ 
        message: "Session ID and user input are required",
        valid: false
      });
    }
    
    // Get stored CAPTCHA
    const session = captchaSessions.get(sessionId);
    
    if (!session) {
      return res.status(400).json({ 
        message: "Invalid or expired CAPTCHA session",
        valid: false
      });
    }
    
    // Check if session is expired (5 minutes)
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (now - session.timestamp > fiveMinutes) {
      captchaSessions.delete(sessionId);
      return res.status(400).json({ 
        message: "CAPTCHA session expired",
        valid: false
      });
    }
    
    // Compare user input with stored text (case-insensitive)
    const isValid = userInput.toLowerCase().trim() === session.text;
    
    if (isValid) {
      // Remove the session after successful verification
      captchaSessions.delete(sessionId);
      res.status(200).json({ 
        message: "CAPTCHA verified successfully",
        valid: true 
      });
    } else {
      res.status(400).json({ 
        message: "Invalid CAPTCHA",
        valid: false 
      });
    }
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    res.status(500).json({ 
      message: "Failed to verify CAPTCHA",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get CAPTCHA status (for debugging)
export const getCaptchaStatus = async (req: Request, res: Response) => {
  try {
    const activeSessions = captchaSessions.size;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    // Count valid sessions
    let validSessions = 0;
    for (const [sessionId, session] of captchaSessions.entries()) {
      if (now - session.timestamp <= fiveMinutes) {
        validSessions++;
      }
    }
    
    res.status(200).json({
      activeSessions,
      validSessions,
      timestamp: now
    });
  } catch (error) {
    console.error('CAPTCHA status error:', error);
    res.status(500).json({ 
      message: "Failed to get CAPTCHA status",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
