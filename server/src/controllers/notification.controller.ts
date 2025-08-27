import { Request, Response } from "express";
import UniversalNotification from "../models/UniversalNotification";
import PageVisit from "../models/PageVisit";

// Get all notifications with pagination
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await UniversalNotification.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UniversalNotification.countDocuments();
    const unreadCount = await UniversalNotification.countDocuments({ isRead: false });

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await UniversalNotification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const result = await UniversalNotification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read", updatedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Failed to mark all notifications as read" });
  }
};

// Create a new notification (internal use)
export const createNotification = async (
  type: "portfolio" | "contact" | "page_visit" | "system",
  title: string,
  message: string,
  data?: any
) => {
  try {
    const notification = new UniversalNotification({
      type,
      title,
      message,
      data,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Check and create page visit milestone notifications
export const checkPageVisitMilestones = async () => {
  try {
    const pageVisit = await PageVisit.findOne();
    if (!pageVisit) return;

    const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000];
    const currentVisits = pageVisit.totalVisits;

    // Get existing milestone notifications to avoid duplicates
    const existingMilestones = await UniversalNotification.find({
      type: "page_visit",
      "data.milestone": { $in: milestones },
    });

    const notifiedMilestones = existingMilestones.map((n: any) => n.data.milestone);

    for (const milestone of milestones) {
      if (currentVisits >= milestone && !notifiedMilestones.includes(milestone)) {
        await createNotification(
          "page_visit",
          "🎉 Page Visit Milestone Reached!",
          `Congratulations! Your website has reached ${milestone.toLocaleString()} visits!`,
          { milestone, currentVisits }
        );
      }
    }
  } catch (error) {
    console.error("Error checking page visit milestones:", error);
  }
};

// Create portfolio notification
export const createPortfolioNotification = async (action: "created" | "updated" | "deleted", portfolioData: any) => {
  const actions = {
    created: {
      title: "🎯 New Portfolio Item Created",
      message: `New project "${portfolioData.title || "Untitled Project"}" has been added to portfolio`,
    },
    updated: {
      title: "✏️ Portfolio Item Updated",
      message: `Project "${portfolioData.title || "Untitled Project"}" has been updated`,
    },
    deleted: {
      title: "🗑️ Portfolio Item Deleted",
      message: `Project "${portfolioData.title || "Untitled Project"}" has been removed from portfolio`,
    },
  };

  await createNotification(
    "portfolio",
    actions[action].title,
    actions[action].message,
    { action, portfolioData }
  );
};

// Create contact notification
export const createContactNotification = async (action: "received" | "status_updated", contactData: any) => {
  if (action === "received") {
    await createNotification(
      "contact",
      "📬 New Contact Inquiry",
      `${contactData.name || "Someone"} sent a message about ${contactData.subject || "video production services"}`,
      { action, contactData }
    );
  } else if (action === "status_updated") {
    await createNotification(
      "contact",
      "📋 Contact Status Updated",
      `Contact inquiry from ${contactData.name || "Unknown"} status updated to ${contactData.status}`,
      { action, contactData }
    );
  }
};
