import { Schema, model, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  type: 'Hackathon' | 'CTF' | 'Coding' | 'Other';
  result: string;
  students: string[];
  date: string;
  description: string;
  images: string[];
  imageUrl?: string;
  rank?: string;
  category?: string;
  eventName?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title:       { type: String, required: true, trim: true },
    type:        { type: String, enum: ['Hackathon', 'CTF', 'Coding', 'Other'], required: true },
    result:      { type: String, default: '' },
    students:    [{ type: String }],
    date:        { type: String, default: '' },
    description: { type: String, default: '' },
    images:      [{ type: String }],
    imageUrl:    { type: String },
    rank:        { type: String },
    category:    { type: String },
    eventName:   { type: String },
    link:        { type: String },
  },
  { timestamps: true }
);

AchievementSchema.index({ type: 1 });

export const Achievement = model<IAchievement>('Achievement', AchievementSchema);
