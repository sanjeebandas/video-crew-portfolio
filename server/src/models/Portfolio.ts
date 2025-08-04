import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
  title: string;
  category: string;
  client?: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  featured: boolean;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PortfolioSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    client: { type: String },
    description: { type: String },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true } // Automatically creates createdAt & updatedAt
);

export default mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
