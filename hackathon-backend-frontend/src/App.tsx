import { useState } from 'react';
import { Layout } from './components/Layout';
import { ItemSearch } from './components/ItemSearch';
import { ItemAnalysis } from './components/ItemAnalysis';
import { ItemHistory } from './components/ItemHistory';
import { WeeklyStats } from './components/WeeklyStats';
import { Leaderboard } from './components/Leaderboard';
import { Account } from './components/Account';
import { Auth } from './components/Auth';
import { LoadingScreen } from './components/LoadingScreen';
import { XPNotification, XPParticles } from './components/XPNotification';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { calculateWeeklyStats, calculateXPToNextLevel } from './utils/calculations';
import { mock } from 'node:test';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const {
    user,
    setUser,
    accessToken,
    isAuthenticated,
    isLoading,
    handleAuthSuccess,
    handleLogout
  } = useAuth();

  const mockLeaderboard = [
  { id: "1", name: "Alice", level: 5, xp: 4200, weeklyXP: 200, rank: 1, isCurrentUser: false },
  { id: "2", name: "Bob", level: 4, xp: 3100, weeklyXP: 150, rank: 2, isCurrentUser: true },
  { id: "3", name: "Charlie", level: 3, xp: 2500, weeklyXP: 120, rank: 3, isCurrentUser: false },
  { id: "4", name: "Diana", level: 2, xp: 1200, weeklyXP: 80, rank: 4, isCurrentUser: false },
  { id: "5", name: "Eve", level: 1, xp: 500, weeklyXP: 30, rank: 5, isCurrentUser: false }
  ];


  const {
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
    handleClearHistory
  } = useUserData(user, accessToken);

  const handleReanalyze = (item: string) => {
    setCurrentPage('home');
    setTimeout(() => handleSearch(item, setUser), 100);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Auth onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  const { weeklyHistory, weeklyXP, averageScore, sustainabilityRate } = calculateWeeklyStats(history);
  const xpToNextLevel = calculateXPToNextLevel(user.level, user.xp);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-8">
            <ItemSearch
              onSearch={(item) => handleSearch(item, setUser)}
              userLevel={user.level}
              userXP={user.xp}
              xpToNextLevel={xpToNextLevel}
            />
            {currentAnalysis && currentAnalysis.item ? (
              <ItemAnalysis analysisData={currentAnalysis} />
            ) : null }
          </div>
        );
      case 'history':
        return (
          <ItemHistory
            history={history}
            onReanalyze={handleReanalyze}
            onClearHistory={handleClearHistory}
          />
        );
      case 'stats':
        return (
          <WeeklyStats
            sustainabilityRate={sustainabilityRate}
            itemsAnalyzed={weeklyHistory.length}
            bestCategory="Electronics"
            weeklyXP={weeklyXP}
            averageScore={averageScore}
            streak={user.currentStreak}
          />
        );
      case 'leaderboard':
        return (
          <Leaderboard
            users={leaderboardData}
            currentUserId={user.id}
          />
        );
      case 'account':
        return (
          <Account
            user={user}
            sustainabilityRate={sustainabilityRate}
            onUpdateProfile={(name, email) => handleUpdateProfile(name, email, setUser)}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
      
      {/* Notifications */}
      <XPNotification
        xpGained={xpNotificationData.xpGained}
        levelUp={xpNotificationData.levelUp}
        newLevel={xpNotificationData.newLevel}
        show={showXPNotification}
        onComplete={() => setShowXPNotification(false)}
      />
      
      <XPParticles 
        show={showXPParticles}
        count={xpNotificationData.levelUp ? 10 : 5}
      />
      {showXPParticles && setTimeout(() => setShowXPParticles(false), 3000)}
      
      <Toaster />
    </>
  );
}