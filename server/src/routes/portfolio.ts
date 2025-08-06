import express from "express";
import {
  createPortfolioItem,
  getPortfolioItemsByCategory,
  getAllPortfolioItems,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/portfolioController";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// @route   POST /api/portfolio
router.post("/", authenticateAdmin, createPortfolioItem);

// ✅ New route: category-based filter
// @route   GET /api/portfolio/category?name=광고 · 홍보 영상
router.get("/category", getPortfolioItemsByCategory);

// @route   GET /api/portfolio
router.get("/", getAllPortfolioItems);

// @route   GET /api/portfolio/:id
router.get("/:id", getPortfolioItemById);

// @route   PUT /api/portfolio/:id
router.put("/:id", authenticateAdmin, updatePortfolioItem);

// @route   DELETE /api/portfolio/:id
router.delete("/:id", authenticateAdmin, deletePortfolioItem);


export default router;
