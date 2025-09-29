import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// Custom interface for decoded JWT payload
interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1]!; // Non-null assertion, safe due to previous check

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is not defined" });
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;

    // Guard check for structure
    if (!decoded || typeof decoded !== "object" || !decoded.id || !decoded.email) {
      return res.status(401).json({ message: "Invalid token structure" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
