import express from "express";
import {
  createPortfolioItem,
  getPortfolioItemsByCategory,
  getAllPortfolioItems,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/portfolioController";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// @route   POST /api/portfolio
router.post("/", authenticateToken, createPortfolioItem);

// @route   GET /api/portfolio/category?name=광고·홍보 영상
router.get("/category", getPortfolioItemsByCategory);

// @route   GET /api/portfolio
router.get("/", getAllPortfolioItems);

// @route   GET /api/portfolio/:id
router.get("/:id", getPortfolioItemById);

// @route   PUT /api/portfolio/:id
router.put("/:id", authenticateToken, updatePortfolioItem);

// @route   DELETE /api/portfolio/:id
router.delete("/:id", authenticateToken, deletePortfolioItem);

export default router;
