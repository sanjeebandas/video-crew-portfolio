import express from "express";
import {
  submitContactForm,
  getAllInquiries,
  updateInquiry,
  deleteInquiry,
} from "../controllers/contact.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// @route   POST /api/contact
// @desc    Publicly submit contact form
router.post("/", submitContactForm);

// @route   GET /api/contact
// @desc    Authenticated: Get all inquiries
router.get("/", authenticateAdmin, getAllInquiries);

// @route   PUT /api/contact/:id
// @desc    Authenticated: Update inquiry status and notes
router.put("/:id", authenticateAdmin, updateInquiry);

// @route   DELETE /api/contact/:id
// @desc    Authenticated: Delete inquiry
router.delete("/:id", authenticateAdmin, deleteInquiry);

export default router;
