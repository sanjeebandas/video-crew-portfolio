import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface for strong typing
export interface IContactInquiry extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "processing" | "completed";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const ContactInquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 255,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "processing", "completed"],
      default: "new",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // handles createdAt and updatedAt
  }
);

// Export model
const ContactInquiry = mongoose.model<IContactInquiry>(
  "ContactInquiry",
  ContactInquirySchema
);

export default ContactInquiry;
