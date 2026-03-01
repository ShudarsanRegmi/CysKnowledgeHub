import { Schema, model, Document } from 'mongoose';

export type TopicType = 'ctf' | 'blog' | 'experiment';

export interface ITopic extends Document {
  title: string;
  slug: string;
  description?: string;
  type: TopicType;
  order: number;
  createdBy: string;   // uid of admin who created it
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    type:        { type: String, enum: ['ctf', 'blog', 'experiment'], default: 'ctf' },
    order:       { type: Number, default: 0 },
    createdBy:   { type: String, required: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
TopicSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Topic = model<ITopic>('Topic', TopicSchema);
