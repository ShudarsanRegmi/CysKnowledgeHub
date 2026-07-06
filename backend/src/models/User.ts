import { Schema, model, Document } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IStudentLink {
  type: 'linkedin' | 'github' | 'portfolio' | 'twitter' | 'other';
  url: string;
  label?: string;
}

export interface IUser extends Document {
  uid: string;           // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: string;      // 'google' | 'password' | etc.
  role: 'student' | 'author' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;

  // ── Student profile fields ──────────────────────────────────────────────
  rollNumber?: string;    // e.g. CH.SC.U4CYS23055
  batch?: string;         // e.g. '2023' | '2024' | '2025'
  section?: string;       // e.g. 'A' | 'B' | 'C'
  campusMail?: string;    // official campus email
  bio?: string;
  links?: IStudentLink[];
  profileComplete: boolean;
}

// ─── Sub-schema ───────────────────────────────────────────────────────────────

const StudentLinkSchema = new Schema<IStudentLink>(
  {
    type:  { type: String, enum: ['linkedin', 'github', 'portfolio', 'twitter', 'other'], required: true },
    url:   { type: String, required: true },
    label: { type: String },
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUser>({
  uid:         { type: String, required: true, unique: true, index: true },
  email:       { type: String, required: true, unique: true },
  displayName: { type: String },
  photoURL:    { type: String },
  provider:    { type: String, required: true, default: 'password' },
  role:        { type: String, enum: ['student', 'author', 'admin'], default: 'student' },
  createdAt:   { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },

  // Student profile
  rollNumber:      { type: String, sparse: true },
  batch:           { type: String, enum: ['2022', '2023', '2024', '2025', '2026'] },
  section:         { type: String, enum: ['A', 'B', 'C', 'D'] },
  campusMail:      { type: String },
  bio:             { type: String, maxlength: 500 },
  links:           { type: [StudentLinkSchema], default: [] },
  profileComplete: { type: Boolean, default: false },
});

export const User = model<IUser>('User', UserSchema);
