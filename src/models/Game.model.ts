import mongoose, { Schema, Document } from 'mongoose';

// Interface for Prize History
export interface IPrizeHistory {
  position: number;
  amount: number;
}

// Interface for Game
export interface IGame extends Document {
  totalPoints: number;
  prizeHistory: IPrizeHistory[];
  gameCredits: number;
  gameScores: number;
  gameTimes: number;
  datePlayed: Date;
  userId: mongoose.Types.ObjectId;
}

// Prize History Schema
const PrizeHistorySchema: Schema = new Schema({
  position: { type: Number, required: true },
  amount: { type: Number, required: true },
});

// Game Schema
const GameSchema: Schema = new Schema({
  totalPoints: { type: Number, required: true },
  prizeHistory: [PrizeHistorySchema],
  gameCredits: { type: Number, required: true },
  gameScores: { type: Number, required: true },
  gameTimes: { type: Number, required: true },
  datePlayed: { type: Date, default: Date.now },
  benchPlayers: { type: Number, required: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Game = mongoose.model<IGame>('Game', GameSchema);
