import { Request, Response } from "express";
import ContactInquiry from "../models/ContactInquiry";
import { sendContactNotification, sendCustomerConfirmation } from "../services/emailService";
import { createContactNotification } from "./notification.controller";

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

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, subject, and message are required" });
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
    try {
      // Send notification to admin
      await sendContactNotification({
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

      // Send confirmation to customer
      await sendCustomerConfirmation({
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
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
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
