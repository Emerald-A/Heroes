import mongoose, { Schema, Document } from 'mongoose';

// Interface for User
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  nationality: string;
  gameHistory: mongoose.Types.ObjectId;
  avatarLink: string;

  // vickie
  getAuthToken(): Promise<string>;
  hashAndComparePassword(password: string): Promise<boolean>;
}

// User Schema
const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  nationality: { type: String, required: true },
  gameHistory: { type: Schema.Types.ObjectId, ref: 'GameHistory' },
  avatarLink: { type: String, default: '' },
});

export const User = mongoose.model<IUser>('User', UserSchema);
