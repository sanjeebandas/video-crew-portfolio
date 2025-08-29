import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

// Get all notifications with pagination
router.get("/", getNotifications);

// Mark all notifications as read (must come before /:id/read)
router.patch("/mark-all-read", markAllAsRead);

// Mark specific notification as read
router.patch("/:id/read", markAsRead);

export default router;
