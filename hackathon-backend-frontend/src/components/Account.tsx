import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  Leaf, 
  Settings,
  LogOut,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AccountProps {
  user: {
    name: string;
    email: string;
    level: number;
    xp: number;
    joinDate: Date;
    totalAnalyses: number;
    bestStreak: number;
    currentStreak: number;
  };
  sustainabilityRate: number;
  onUpdateProfile: (name: string, email: string) => void;
  onLogout: () => void;
}

export function Account({ user, sustainabilityRate, onUpdateProfile, onLogout }: AccountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSave = () => {
    onUpdateProfile(editName, editEmail);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(false);
  };

  const xpToNextLevel = (user.level * 1000) - (user.xp % 1000);
  const xpProgress = ((user.xp % 1000) / 1000) * 100;


  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const achievements = [
    { id: 1, name: 'First Analysis', description: 'Completed your first environmental impact analysis', earned: true },
    { id: 2, name: 'Eco Warrior', description: 'Reached Level 10', earned: user.level >= 10 },
    { id: 3, name: 'Sustainability Champion', description: 'Maintained 80%+ sustainability rating', earned: user.sustainabilityRating >= 80 },
    { id: 4, name: 'Streak Master', description: 'Maintained a 7-day analysis streak', earned: user.bestStreak >= 7 },
    { id: 5, name: 'Analyzer', description: 'Completed 100 analyses', earned: user.totalAnalyses >= 100 },
    { id: 6, name: 'Green Guru', description: 'Reached Level 25', earned: user.level >= 25 }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Account</h2>
        <Button variant="outline" onClick={onLogout} className="text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile</span>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-3">
                    <Badge variant="default" className="text-lg px-3 py-1">
                      Level {user.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {user.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress to Level {user.level + 1}</span>
                <span>{xpToNextLevel} XP needed</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">{user.totalAnalyses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{user.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Best Streak</p>
                <p className="text-2xl font-bold">{user.bestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sustainability Rating</p>
                <p className="text-2xl font-bold">{sustainabilityRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Achievements</span>
            <Badge variant="outline">
              {earnedAchievements.length}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-muted/30 border-muted opacity-50'
                }`}
              >
                <div className={`rounded-full p-2 ${
                  achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <Badge variant="default" className="text-xs">Earned</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>{user.joinDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account type</span>
              <Badge variant="outline">Free</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data privacy</span>
              <span className="text-green-600">Protected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}