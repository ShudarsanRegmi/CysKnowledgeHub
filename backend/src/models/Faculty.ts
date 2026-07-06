import { Schema, model, Document } from 'mongoose';

export interface IFaculty extends Document {
  name: string;
  designation: string;
  email: string;
  linkedinUrl?: string;
  scholarUrl?: string;
  bio: string;
  photoUrl?: string;
  subjects: string[];
  researchInterests: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>(
  {
    name:             { type: String, required: true, trim: true },
    designation:      { type: String, required: true, trim: true },
    email:            { type: String, required: true, trim: true },
    linkedinUrl:      { type: String },
    scholarUrl:       { type: String },
    bio:              { type: String, required: true, trim: true },
    photoUrl:         { type: String },
    subjects:         [{ type: String, trim: true }],
    researchInterests: [{ type: String, trim: true }],
    order:            { type: Number, default: 0 },
  },
  { timestamps: true }
);

FacultySchema.index({ order: 1 });

export const Faculty = model<IFaculty>('Faculty', FacultySchema);
