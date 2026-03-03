import type { IUser } from "../model/UserModel";

export interface PlayResult {
  ranks: number[];
  winner: number;
  rank: number;
  reward: number;
  newScore: number;
}

export interface LeaderboardItem {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

export interface AuthPayload {
  initData: string;
}

export interface AuthResponse {
  user: IUser;
}

export interface ApiError {
  code: number;
  message: string;
}
