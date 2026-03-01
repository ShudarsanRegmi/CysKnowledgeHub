import { Schema, model, Document } from 'mongoose';

const TopicGroupSchema = new Schema(
  {
    name:  { type: String },
    type:  { type: String, enum: ['must-know', 'good-to-know', 'tools'] },
    items: [{ type: String }],
  },
  { _id: false }
);

const StepSchema = new Schema(
  {
    title:       { type: String },
    description: { type: String },
    duration:    { type: String },
    resources:   [{ type: String }],
    topics:      [TopicGroupSchema],
  },
  { _id: false }
);

export interface IRoadmap extends Document {
  id:       string; // slug, e.g. 'SOC_ANALYST'
  title:    string;
  subtitle: string;
  steps:    any[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    id:       { type: String, required: true, unique: true, index: true },
    title:    { type: String, required: true },
    subtitle: { type: String, default: '' },
    steps:    [StepSchema],
  },
  { timestamps: true }
);

export const Roadmap = model<IRoadmap>('Roadmap', RoadmapSchema);
