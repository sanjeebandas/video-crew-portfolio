import { Request, Response } from "express";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { recordFailedLogin, resetLoginAttempts } from "../middlewares/rateLimiter";

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Record failed login attempt
      recordFailedLogin(req);
      
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      // Record failed login attempt
      recordFailedLogin(req);
      
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Reset failed attempts on successful login
    resetLoginAttempts(req);

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    // If middleware passed, token is valid
    res.status(200).json({ 
      success: true, 
      message: "Token is valid",
      user: req.user 
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
