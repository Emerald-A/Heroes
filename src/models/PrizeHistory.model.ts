import mongoose, { Schema, Document } from 'mongoose';

// Interface for Prize History
export interface IPrizeHistory extends Document {
  userId: { type: Schema.Types.ObjectId; ref: 'User'; required: true };
  position: 'Gold' | 'Silver' | 'Bronze';
  prizeAmount: number;
  bonusCredit: number;
  dateWon: Date;
}

// Prize History Schema
const PrizeHistorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  position: {
    type: String,
    enum: ['Gold', 'Silver', 'Bronze'],
    required: true,
  },
  prizeAmount: { type: Number },
  bonusCredit: { type: Number },
  dateWon: { type: Date, default: Date.now },
});

PrizeHistorySchema.pre<IPrizeHistory>('save', function (next) {
  const prizeHistory = this;

  switch (prizeHistory.position) {
    case 'Gold':
      prizeHistory.prizeAmount = 1500;
      prizeHistory.bonusCredit = 50000;
      break;
    case 'Silver':
      prizeHistory.prizeAmount = 1000;
      prizeHistory.bonusCredit = 30000;
      break;
    case 'Bronze':
      prizeHistory.prizeAmount = 500;
      prizeHistory.bonusCredit = 20000;
      break;
    default:
      return next(new Error('Invalid position for prize calculation'));
  }

  next();
});

export const PrizeHistory = mongoose.model<IPrizeHistory>('PrizeHistory', PrizeHistorySchema);
