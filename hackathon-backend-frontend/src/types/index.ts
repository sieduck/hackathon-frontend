export interface HistoryItem {
  id: string;
  item: string;
  score: number;
  xpGained: number;
  analyzedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  joinDate: Date;
  totalAnalyses: number;
  bestStreak: number;
  currentStreak: number;
  sustainabilityRating: number;
}

export interface XPNotificationData {
  xpGained: number;
  levelUp: boolean;
  newLevel?: number;
}

export interface WeeklyStats {
  weeklyHistory: HistoryItem[];
  weeklyXP: number;
  averageScore: number;
  sustainabilityRate: number;
}