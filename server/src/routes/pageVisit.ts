import express from "express";
import { incrementPageVisit, getPageVisits, resetPageVisits } from "../controllers/pageVisit.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// Public route to increment page visit (called on every page load)
router.post("/increment", incrementPageVisit);

// Admin routes (protected)
router.get("/", authenticateAdmin, getPageVisits);
router.delete("/reset", authenticateAdmin, resetPageVisits);

export default router;
