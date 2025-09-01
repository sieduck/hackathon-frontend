import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, BarChart3, Target, Calendar, Award } from 'lucide-react';
import { getSustainabilityProgress, getAdaptiveProgress } from '../utils/progress';

interface WeeklyStatsProps {
  sustainabilityRate: number;
  itemsAnalyzed: number;
  bestCategory: string;
  weeklyXP: number;
  averageScore: number;
  streak: number;
}

export function WeeklyStats({ 
  sustainabilityRate, 
  itemsAnalyzed, 
  bestCategory, 
  weeklyXP, 
  averageScore,
  streak 
}: WeeklyStatsProps) {
  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 4) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    if (score <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGrade = (rate: number) => {
    if (rate >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (rate >= 80) return { grade: 'A', color: 'text-green-500' };
    if (rate >= 70) return { grade: 'B', color: 'text-yellow-500' };
    if (rate >= 60) return { grade: 'C', color: 'text-orange-500' };
    return { grade: 'D', color: 'text-red-500' };
  };

  const grade = getScoreGrade(sustainabilityRate);
  const sustainabilityConfig = getSustainabilityProgress(sustainabilityRate);
  const averageScoreConfig = getAdaptiveProgress(averageScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weekly Statistics</h2>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>This Week</span>
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sustainability Rate */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              <span>Sustainability Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${grade.color}`}>
                {sustainabilityRate.toFixed(1)}%
              </span>
              <Badge className={`${grade.color} border-current`} variant="outline">
                Grade {grade.grade}
              </Badge>
            </div>
            <Progress value={sustainabilityConfig.value} className={`h-2 ${sustainabilityConfig.className}`} />
            <p className="text-sm text-muted-foreground">
              Percentage of eco-friendly choices this week
            </p>
          </CardContent>
        </Card>

        {/* Items Analyzed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Items Analyzed</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-primary">
                {itemsAnalyzed}
              </span>
              {itemsAnalyzed > 10 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Goal: 15</span>
                <span>{Math.min(itemsAnalyzed, 15)}/15</span>
              </div>
              <Progress value={(itemsAnalyzed / 15) * 100} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Keep analyzing to build better habits!
            </p>
          </CardContent>
        </Card>

        {/* Weekly XP */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Award className="h-5 w-5 text-primary" />
              <span>Weekly XP</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className={`text-3xl font-bold ${weeklyXP > 0 ? 'text-primary' : 'text-destructive'}`}>
                {weeklyXP > 0 ? '+' : ''}{weeklyXP}
              </span>
              {weeklyXP > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Best Week: +240 XP</span>
                <span className={weeklyXP > 0 ? 'text-green-600' : 'text-red-600'}>
                  {weeklyXP > 0 ? 'Gaining' : 'Losing'}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose eco-friendly items to gain more XP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Average Score */}
        <Card>
          <CardHeader>
            <CardTitle>Average Impact Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xl">Average Score</span>
              <span className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}/10
              </span>
            </div>
            <Progress value={averageScoreConfig.value} className={`h-2 ${averageScoreConfig.className}`} />
            <p className="text-sm text-muted-foreground">
              Lower scores indicate more eco-friendly choices
            </p>
          </CardContent>
        </Card>

        {/* Best Category & Streak */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Best Category</span>
                <Badge variant="default">{bestCategory}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Analysis Streak</span>
                <Badge variant="outline" className="text-primary">
                  {streak} days
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep up your streak by analyzing at least one item daily!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}