import { Schema, model, Document } from 'mongoose';

export interface IPublication extends Document {
  title: string;
  kind: 'Paper' | 'Patent' | 'Book Chapter' | 'Poster';
  publicationDate: string;
  venue: string;
  publisher: string;
  venueType: 'Conference' | 'Journal' | 'Workshop' | 'Symposium' | 'Other';
  isInternational: boolean;
  abstract: string;
  keywords: string[];
  authors: string[];
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PublicationSchema = new Schema<IPublication>(
  {
    title:           { type: String, required: true, trim: true },
    kind:            { type: String, enum: ['Paper', 'Patent', 'Book Chapter', 'Poster'], required: true },
    publicationDate: { type: String, required: true, trim: true },
    venue:           { type: String, required: true, trim: true },
    publisher:       { type: String, required: true, trim: true },
    venueType:       { type: String, enum: ['Conference', 'Journal', 'Workshop', 'Symposium', 'Other'], required: true },
    isInternational: { type: Boolean, default: false },
    abstract:        { type: String, default: '' },
    keywords:        [{ type: String }],
    authors:         [{ type: String }],
    link:            { type: String },
  },
  { timestamps: true }
);

export const Publication = model<IPublication>('Publication', PublicationSchema);
