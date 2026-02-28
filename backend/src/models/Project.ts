import { Schema, model, Document } from 'mongoose';

const ProjectLinkSchema = new Schema(
  { label: String, url: String, type: String },
  { _id: false }
);

export interface IProject extends Document {
  title: string;
  abstract: string;
  description?: string;
  year?: string;
  batch?: string;
  categories: string[];
  tags: string[];
  links: { label: string; url: string; type?: string }[];
  featured: boolean;
  imageUrl?: string;
  contributors: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title:        { type: String, required: true, trim: true },
    abstract:     { type: String, required: true, trim: true },
    description:  { type: String },
    year:         { type: String },
    batch:        { type: String },
    categories:   [{ type: String, trim: true }],
    tags:         [{ type: String, trim: true }],
    links:        [ProjectLinkSchema],
    featured:     { type: Boolean, default: false },
    imageUrl:     { type: String },
    contributors: [{ type: String }],
  },
  { timestamps: true }
);

ProjectSchema.index({ categories: 1 });
ProjectSchema.index({ featured: 1 });

export const Project = model<IProject>('Project', ProjectSchema);
