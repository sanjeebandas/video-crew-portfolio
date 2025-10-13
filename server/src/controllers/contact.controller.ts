import { Request, Response } from "express";
import ContactInquiry from "../models/ContactInquiry";
import { sendContactNotification, sendCustomerConfirmation } from "../services/emailService";
import { createContactNotification } from "./notification.controller";
import rateLimit from "express-rate-limit";

// Security: Rate limiting for contact form (simple for portfolio website)
export const contactFormRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many contact form submissions, please try again later",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//Submit a contact inquiry (Public)
//POST /api/contact
export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      subject,
      message,
      company,
      phone,
      budget,
      service,
      preferredDate,
      referenceVideos,
      websiteLinks,
      productionPurpose,
      uploadPlatform,
      videoCount,
      runningTime,
    } = req.body;

    // Security: Basic input validation for portfolio website
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, subject, and message are required" });
    }

    // Security: Length validation 
    if (name.length > 100) {
      return res.status(400).json({ message: "Name must be less than 100 characters" });
    }
    if (email.length > 254) {
      return res.status(400).json({ message: "Email must be less than 254 characters" });
    }
    if (subject.length > 200) {
      return res.status(400).json({ message: "Subject must be less than 200 characters" });
    }
    if (message.length > 2000) {
      return res.status(400).json({ message: "Message must be less than 2000 characters" });
    }

    // Security: Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const inquiry = await ContactInquiry.create({
      name,
      email,
      subject,
      message,
      company,
      phone,
      budget,
      service,
      preferredDate,
      referenceVideos,
      websiteLinks,
      productionPurpose,
      uploadPlatform,
      videoCount,
      runningTime,
    });

    // Create notification for new contact inquiry
    await createContactNotification("received", inquiry);

    // Send email notifications
    console.log("📧 Starting email notification process...");
    try {
      console.log("📧 Sending admin notification...");
      // Send notification to admin
      const adminEmailResult = await sendContactNotification({
        name,
        email,
        phone,
        company,
        budget,
        preferredDate,
        service,
        subject,
        message,
        referenceVideos,
        websiteLinks,
        productionPurpose,
        uploadPlatform,
        videoCount,
        runningTime,
      });
      console.log("📧 Admin notification result:", adminEmailResult);

      console.log("📧 Sending customer confirmation...");
      // Send confirmation to customer
      const customerEmailResult = await sendCustomerConfirmation({
        name,
        email,
        phone,
        company,
        budget,
        preferredDate,
        service,
        subject,
        message,
        referenceVideos,
        websiteLinks,
        productionPurpose,
        uploadPlatform,
        videoCount,
        runningTime,
      });
      console.log("📧 Customer confirmation result:", customerEmailResult);
      
      console.log("✅ All emails sent successfully!");
    } catch (emailError) {
      console.error('❌ Failed to send email notifications:', emailError);
      // Don't fail the request if email fails, just log the error
    }

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Get all inquiries (Admin only)
//GET /api/contact
export const getAllInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });

    res.status(200).json({ contacts: inquiries });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//Update inquiry status and admin notes (Admin only)
//PUT /api/contact/:id
export const updateInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ["new", "processing", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await ContactInquiry.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    // Create notification for status update if status was changed
    if (status) {
      await createContactNotification("status_updated", updated);
    }

    res.status(200).json({
      message: "Inquiry updated successfully",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE /api/contact/:id
// Admin-only: Delete an inquiry
export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await ContactInquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
