import { Request, Response } from "express";
import ContactInquiry from "../models/ContactInquiry";

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
