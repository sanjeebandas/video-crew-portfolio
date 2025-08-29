import express from "express";
import { incrementPageVisit, getPageVisits, resetPageVisits } from "../controllers/pageVisit.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Public route to increment page visit (called on every page load)
router.post("/increment", incrementPageVisit);

// Admin routes (protected)
router.get("/", authenticateToken, getPageVisits);
router.delete("/reset", authenticateToken, resetPageVisits);

export default router;
