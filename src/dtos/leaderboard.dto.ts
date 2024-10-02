import { Types } from "mongoose";

export interface ILeaderboardDTO {
  userId: Types.ObjectId;
  username: string;
  totalPoints: number;
}
