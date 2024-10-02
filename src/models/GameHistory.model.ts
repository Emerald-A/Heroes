import mongoose, { Schema, Document } from 'mongoose';

// Interface for Game History
export interface IGameHistory extends Document {
  totalGames: number;
  totalPrizes: number;
  userId: mongoose.Types.ObjectId;
}

// Game History Schema
const GameHistorySchema: Schema = new Schema({
  totalGames: { type: Number, required: true, default: 0 },
  totalPrizes: { type: Number, required: true, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const GameHistory = mongoose.model<IGameHistory>('GameHistory', GameHistorySchema);
