import express from "express";
import { loginAdmin, validateToken } from "../controllers/authController";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/validate", authenticateToken, validateToken);

export default router;
