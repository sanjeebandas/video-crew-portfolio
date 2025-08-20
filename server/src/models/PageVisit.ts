import mongoose, { Schema, Document } from 'mongoose';

export interface IPageVisit extends Document {
  totalVisits: number;
  lastUpdated: Date;
}

const PageVisitSchema: Schema = new Schema({
  totalVisits: {
    type: Number,
    default: 0,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one document exists
PageVisitSchema.index({}, { unique: true });

export default mongoose.model<IPageVisit>('PageVisit', PageVisitSchema);
