import mongoose, { Schema, Document } from "mongoose";

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "processing" | "completed";
  adminNotes?: string;
  company?: string;
  phone?: string;
  budget?: string;
  service?: string;
  preferredDate?: string;
  referenceVideos?: string;
  websiteLinks?: string;
  productionPurpose?: string;
  uploadPlatform?: string;
  videoCount?: string;
  runningTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 255 },
    subject: { type: String, required: true, maxlength: 255 },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "processing", "completed"],
      default: "new",
    },
    adminNotes: { type: String, default: "" },

    // Extra frontend fields (Figma form)
    company: { type: String },
    phone: { type: String },
    budget: { type: String },
    service: { type: String },
    preferredDate: { type: String },
    referenceVideos: { type: String },
    websiteLinks: { type: String },
    productionPurpose: { type: String },
    uploadPlatform: { type: String },
    videoCount: { type: String },
    runningTime: { type: String },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const ContactInquiry = mongoose.model<IContactInquiry>(
  "ContactInquiry",
  ContactInquirySchema
);

export default ContactInquiry;
