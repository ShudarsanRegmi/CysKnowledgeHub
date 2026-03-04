import { Schema, model, Document, Types } from 'mongoose';

/**
 * Tracks unique article views.
 * viewerKey = Firebase UID (logged-in) or IP address (anonymous).
 * The compound unique index ensures each viewer is counted at most once per article.
 */
export interface IArticleView extends Document {
  articleId: Types.ObjectId;
  viewerKey: string;
  viewedAt: Date;
}

const ArticleViewSchema = new Schema<IArticleView>({
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
  viewerKey: { type: String, required: true },
  viewedAt:  { type: Date, default: Date.now },
});

// One view per (article, viewer) — upsert on this will be a no-op for repeat visits
ArticleViewSchema.index({ articleId: 1, viewerKey: 1 }, { unique: true });

export default model<IArticleView>('ArticleView', ArticleViewSchema);
