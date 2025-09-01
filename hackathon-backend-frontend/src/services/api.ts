import { projectId, publicAnonKey } from '../utils/supabase/info';
import { User, HistoryItem } from '../types';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-327fee6a`;

export const apiService = {
  // -------------------
  // Load user data
  // -------------------
  async loadUserData(userId: string, token: string) {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to load user data');

    const { userData, history } = await response.json();
    return {
      userData: {
        ...userData,
        joinDate: new Date(userData.joinDate),
      },
      history: history.map((item: any) => ({
        ...item,
        analyzedAt: new Date(item.analyzedAt),
      })),
    };
  },

  // -------------------
  // Call Python backend
  // -------------------
  async analyzeWithPython(item: string) {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_name: item }),
    });

    if (!response.ok) throw new Error('Failed to analyze item via Python backend');

    return response.json();
  },

  // -------------------
  // Load leaderboard (FIXED)
  // -------------------
  async loadLeaderboard(currentUserId?: string) {
    const response = await fetch(`${BASE_URL}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load leaderboard');
    }

    const { leaderboard } = await response.json();
    if (!Array.isArray(leaderboard)) return [];

    // Normalize into LeaderboardUser format
    return leaderboard.map((u: any, index: number) => ({
      id: u.id,
      name: u.name || "Unknown",
      level: u.level || 1,
      xp: u.xp || 0,
      weeklyXP: u.weeklyXP || 0,         // default if backend doesn’t return it
      rank: index + 1,                   // auto-rank by sorted order
      isCurrentUser: currentUserId ? u.id === currentUserId : false
    }));
  },

  // -------------------
  // Supabase analyze (serverless)
  // -------------------
  async analyzeItem(item: string) {
    const response = await fetch(`${BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item }),
    });

    if (!response.ok) throw new Error('Failed to analyze item');

    return response.json();
  },

  // -------------------
  // Add analysis to history
  // -------------------
  async addAnalysisToHistory(userId: string, token: string, historyItem: HistoryItem) {
    const response = await fetch(`${BASE_URL}/user/${userId}/analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historyItem),
    });

    if (!response.ok) throw new Error('Failed to add analysis to history');

    const { userData, history } = await response.json();
    return {
      userData: {
        ...userData,
        joinDate: new Date(userData.joinDate),
      },
      history: history.map((item: any) => ({
        ...item,
        analyzedAt: new Date(item.analyzedAt),
      })),
    };
  },

  // -------------------
  // Update user profile
  // -------------------
  async updateUserProfile(userId: string, token: string, updates: { name?: string; email?: string }) {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update profile');

    const { userData } = await response.json();
    return {
      ...userData,
      joinDate: new Date(userData.joinDate),
    };
  },
};
