import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { User, HistoryItem, XPNotificationData } from '../types';
import { createHistoryItem } from '../utils/calculations';
import { toast } from 'sonner@2.0.3';

export const useUserData = (user: User | null, accessToken: string | null) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [showXPParticles, setShowXPParticles] = useState(false);
  const [xpNotificationData, setXpNotificationData] = useState<XPNotificationData>({
    xpGained: 0,
    levelUp: false,
  });

  // ----------------------
  // Load user history
  // ----------------------
  const loadUserHistory = async () => {
    if (!user || !accessToken) return;
    try {
      const { history: userHistory } = await apiService.loadUserData(user.id, accessToken);
      setHistory(userHistory);
    } catch (error) {
      console.error('Load user history error:', error);
    }
  };

  // ----------------------
  // Load leaderboard
  // ----------------------
  const loadLeaderboard = async () => {
    try {
      const leaderboard = await apiService.loadLeaderboard(user?.id);
      setLeaderboardData(
        leaderboard.map((u: any) => ({
          ...u,
          isCurrentUser: u.id === user?.id,
        }))
      );
    } catch (error) {
      console.error('Load leaderboard error:', error);
    }
  };

  // ----------------------
  // Handle item search
  // ----------------------
  const handleSearch = async (item: string, updateUser: (userData: User) => void) => {
    if (!user || !accessToken) return;

    try {
      const analysisData = await apiService.analyzeWithPython(item);
      setCurrentAnalysis(analysisData);

      const historyItem = createHistoryItem(analysisData);
      const { userData, history: updatedHistory } = await apiService.addAnalysisToHistory(
        user.id,
        accessToken,
        historyItem
      );

      const levelUp = userData.level > user.level;
      updateUser(userData);
      setHistory(updatedHistory);

      // Show notifications
      setXpNotificationData({
        xpGained: analysisData.xpGained,
        levelUp,
        newLevel: userData.level,
      });
      setShowXPNotification(true);
      setShowXPParticles(true);

      // Toast feedback
      if (levelUp) {
        toast.success(`🎉 Level up! You reached Level ${userData.level}!`);
      } else if (analysisData.xpGained > 0) {
        toast.success(`+${analysisData.xpGained} XP gained!`);
      } else {
        toast.error(`${analysisData.xpGained} XP lost. Choose more eco-friendly items!`);
      }

      // Refresh leaderboard
      loadLeaderboard();
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to analyze item');
    }
  };

  // ----------------------
  // Handle profile update
  // ----------------------
  const handleUpdateProfile = async (name: string, email: string, updateUser: (userData: User) => void) => {
    if (!user || !accessToken) return;

    try {
      const userData = await apiService.updateUserProfile(user.id, accessToken, { name, email });
      updateUser(userData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  // ----------------------
  // Clear history
  // ----------------------
  const handleClearHistory = async () => {
    if (!user || !accessToken) return;

    try {
      await apiService.updateUserProfile(user.id, accessToken, {});
      setHistory([]);
      toast.success('History cleared');
    } catch (error) {
      console.error('Clear history error:', error);
      toast.error('Failed to clear history');
    }
  };

  // ----------------------
  // Load data on mount
  // ----------------------
  useEffect(() => {
    if (user && accessToken) {
      loadUserHistory();
      loadLeaderboard();
    }
  }, [user, accessToken]);

  return {
    history,
    leaderboardData,
    currentAnalysis,
    showXPNotification,
    setShowXPNotification,
    showXPParticles,
    setShowXPParticles,
    xpNotificationData,
    handleSearch,
    handleUpdateProfile,
    handleClearHistory,
  };
};
