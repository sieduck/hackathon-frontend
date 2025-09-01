import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { apiService } from '../services/api';
import { User, HistoryItem } from '../types';
import { toast } from 'sonner@2.0.3';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const session = await authService.getSession();
      if (session?.access_token && session?.user) {
        const { userData } = await apiService.loadUserData(session.user.id, session.access_token);
        setUser(userData);
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (authUser: any, authData: any) => {
    setUser({
      ...authData.userData,
      joinDate: new Date(authData.userData.joinDate)
    });
    setAccessToken(authData.accessToken);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    setUser,
    accessToken,
    isAuthenticated,
    isLoading,
    handleAuthSuccess,
    handleLogout
  };
};