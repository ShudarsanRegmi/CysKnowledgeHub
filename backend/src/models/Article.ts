import { Schema, model, Document, Types } from 'mongoose';

export type ArticleStatus = 'draft' | 'pending' | 'approved' | 'published' | 'rejected';
export type ContentType = 'markdown' | 'novel';

export interface IArticle extends Document {
  title: string;
  slug: string;
  topicId: Types.ObjectId;
  content: string;            // Markdown string OR JSON-stringified Tiptap document
  contentType: ContentType;   // Determines how content is rendered
  excerpt?: string;           // Short description / preview text
  coverImage?: string;        // URL to cover image
  authorUid: string;          // Firebase UID
  authorName: string;
  status: ArticleStatus;
  rejectionReason?: string;
  order: number;              // Display order within topic
  tags: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    topicId:         { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    content:         { type: String, required: true },
    contentType:     { type: String, enum: ['markdown', 'novel'], default: 'markdown' },
    excerpt:         { type: String, trim: true },
    coverImage:      { type: String },
    authorUid:       { type: String, required: true, index: true },
    authorName:      { type: String, required: true },
    status:          {
      type: String,
      enum: ['draft', 'pending', 'approved', 'published', 'rejected'],
      default: 'draft',
    },
    rejectionReason: { type: String },
    order:           { type: Number, default: 0 },
    tags:            [{ type: String, trim: true }],
    viewCount:       { type: Number, default: 0 },
    likeCount:       { type: Number, default: 0 },
    publishedAt:     { type: Date },
  },
  { timestamps: true }
);

// Auto-generate slug from title + timestamp when not provided
ArticleSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();
  }
  next();
});

export const Article = model<IArticle>('Article', ArticleSchema);
