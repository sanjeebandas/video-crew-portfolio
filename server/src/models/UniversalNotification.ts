import mongoose, { Schema, Document } from "mongoose";

export interface IUniversalNotification extends Document {
  type: "portfolio" | "contact" | "page_visit" | "system";
  title: string;
  message: string;
  isRead: boolean;
  data?: any; // JSON field for additional data
  createdAt: Date;
  updatedAt: Date;
}

const UniversalNotificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["portfolio", "contact", "page_visit", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Schema.Types.Mixed, // JSON field for additional data
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
UniversalNotificationSchema.index({ isRead: 1, createdAt: -1 });
UniversalNotificationSchema.index({ type: 1, createdAt: -1 });

// Auto-delete notifications older than 20 days (configurable)
UniversalNotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 20 * 24 * 60 * 60 } // 20 days in seconds
);

const UniversalNotification = mongoose.model<IUniversalNotification>(
  "UniversalNotification",
  UniversalNotificationSchema
);

export default UniversalNotification;
