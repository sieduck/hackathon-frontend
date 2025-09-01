import { HistoryItem, WeeklyStats } from '../types';

export const calculateWeeklyStats = (history: HistoryItem[]): WeeklyStats => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  
  const weeklyHistory = history.filter(item => item.analyzedAt >= weekStart);
  const weeklyXP = weeklyHistory.reduce((sum, item) => sum + item.xpGained, 0);
  const averageScore = weeklyHistory.length > 0 
    ? weeklyHistory.reduce((sum, item) => sum + item.score, 0) / weeklyHistory.length 
    : 0;
  const sustainabilityRate = weeklyHistory.length > 0
    ? (weeklyHistory.filter(item => item.score <= 5).length / weeklyHistory.length) * 100
    : 0;

  return {
    weeklyHistory,
    weeklyXP,
    averageScore,
    sustainabilityRate
  };
};

export const calculateXPToNextLevel = (level: number, xp: number): number => {
  return (level * 1000) - (xp % 1000);
};

export const createHistoryItem = (analysisData: any): HistoryItem => {
  return {
    id: Date.now().toString(),
    item: analysisData.item,
    score: analysisData.sustainabilityScore,
    xpGained: analysisData.xpGained,
    analyzedAt: new Date()
  };
};