import { Schema, model, Document } from 'mongoose';

export type WriteupStatus = 'draft' | 'pending' | 'published' | 'rejected';
export type WriteupDifficulty = 'easy' | 'medium' | 'hard';
export type WriteupCategory = 'web' | 'crypto' | 'pwn' | 'rev' | 'forensics' | 'misc';

export interface ICTFWriteup extends Document {
  title: string;
  slug: string;
  eventName: string;
  eventSlug: string;
  challengeName: string;
  category: WriteupCategory;
  difficulty: WriteupDifficulty;
  content: string;            // Markdown string OR JSON-stringified Tiptap document
  contentType: 'markdown' | 'novel';
  coverImage?: string;        // URL to cover image
  authorUid: string;          // Firebase UID
  authorName: string;
  tags: string[];
  status: WriteupStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CTFWriteupSchema = new Schema<ICTFWriteup>(
  {
    title:         { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    eventName:     { type: String, required: true, trim: true },
    eventSlug:     { type: String, required: true, lowercase: true, trim: true, index: true },
    challengeName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true,
    },
    content:     { type: String, required: true },
    contentType: { type: String, enum: ['markdown', 'novel'], default: 'markdown' },
    coverImage:  { type: String },
    authorUid:   { type: String, required: true, index: true },
    authorName:  { type: String, required: true },
    tags:        [{ type: String, trim: true, index: true }],
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'draft',
    },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title + timestamp when not provided
CTFWriteupSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();
  }
  // Auto-generate eventSlug from eventName if not provided
  if (!this.eventSlug && this.eventName) {
    this.eventSlug = this.eventName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const CTFWriteup = model<ICTFWriteup>('CTFWriteup', CTFWriteupSchema);
