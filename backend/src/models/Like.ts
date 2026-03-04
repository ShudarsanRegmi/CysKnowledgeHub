import { Schema, model, Document, Types } from 'mongoose';

export interface ILike extends Document {
  userId: string;              // Firebase UID of the user
  articleId: Types.ObjectId;  // Reference to Article
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId:    { type: String, required: true, index: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A user can only like an article once
LikeSchema.index({ userId: 1, articleId: 1 }, { unique: true });

export const Like = model<ILike>('Like', LikeSchema);
