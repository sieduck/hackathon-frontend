import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  level: number;
  xp: number;
  weeklyXP: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId: string;
}

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-yellow-900';
      case 2:
        return 'bg-gray-400 text-gray-900';
      case 3:
        return 'bg-amber-600 text-amber-900';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const topThree = users.slice(0, 3);
  const remaining = users.slice(3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <Badge variant="outline" className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>Global Rankings</span>
        </Badge>
      </div>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Top Eco Warriors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {topThree.map((user, index) => (
              <div 
                key={user.id}
                className={`text-center p-4 rounded-lg ${
                  user.isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30'
                }`}
              >
                <div className="flex justify-center mb-3">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className="mx-auto mb-3 h-12 w-12">
                  <AvatarFallback className={getRankBadgeColor(user.rank)}>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-medium truncate">{user.name}</h4>
                <div className="space-y-1 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Level {user.level}
                  </Badge>
                  <p className="text-sm font-bold text-primary">
                    {user.xp.toLocaleString()} XP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +{user.weeklyXP} this week
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>All Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div 
                key={user.id}
                className={`flex items-center space-x-4 p-3 rounded-lg border transition-colors ${
                  user.isCurrentUser 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted/50 border-border'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={user.rank <= 3 ? getRankBadgeColor(user.rank) : ''}>
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{user.name}</h4>
                    {user.isCurrentUser && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <span>Level {user.level}</span>
                    <span>•</span>
                    <span>{user.xp.toLocaleString()} XP</span>
                  </div>
                </div>

                {/* Weekly XP */}
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    user.weeklyXP > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.weeklyXP > 0 ? '+' : ''}{user.weeklyXP}
                  </div>
                  <div className="text-xs text-muted-foreground">this week</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs font-medium">Most Improved</p>
              <p className="text-xs text-muted-foreground">{users[Math.floor(Math.random() * Math.min(5, users.length))]?.name || 'TBD'}</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Award className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-xs font-medium">Eco Champion</p>
              <p className="text-xs text-muted-foreground">{users[0]?.name || 'TBD'}</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Medal className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs font-medium">Most Analyses</p>
              <p className="text-xs text-muted-foreground">{users[Math.floor(Math.random() * Math.min(3, users.length))]?.name || 'TBD'}</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-xs font-medium">Streak Master</p>
              <p className="text-xs text-muted-foreground">{users[Math.floor(Math.random() * Math.min(4, users.length))]?.name || 'TBD'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to add mock weekly achievements data
export const addMockAchievements = (users: LeaderboardUser[]) => {
  const achievements = [
    { type: 'most_improved', user: users[Math.floor(Math.random() * Math.min(5, users.length))]?.name || 'Someone' },
    { type: 'eco_champion', user: users[0]?.name || 'Champion' },
    { type: 'most_analyses', user: users[Math.floor(Math.random() * Math.min(3, users.length))]?.name || 'Analyzer' },
    { type: 'streak_master', user: users[Math.floor(Math.random() * Math.min(4, users.length))]?.name || 'Streaker' }
  ];
  return achievements;
};