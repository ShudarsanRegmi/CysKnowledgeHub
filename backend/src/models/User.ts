import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;          // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: string;     // 'google' | 'password' | etc.
  role: 'student' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
}

const UserSchema = new Schema<IUser>({
  uid:         { type: String, required: true, unique: true, index: true },
  email:       { type: String, required: true, unique: true },
  displayName: { type: String },
  photoURL:    { type: String },
  provider:    { type: String, required: true, default: 'password' },
  role:        { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt:   { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
});

export const User = model<IUser>('User', UserSchema);
