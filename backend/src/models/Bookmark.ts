import { Schema, model, Document, Types } from 'mongoose';

export interface IBookmark extends Document {
  userId: string;              // Firebase UID of the user
  articleId: Types.ObjectId;  // Reference to Article
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId:    { type: String, required: true, index: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A user can only bookmark an article once
BookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export const Bookmark = model<IBookmark>('Bookmark', BookmarkSchema);
