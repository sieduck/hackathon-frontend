import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { History, RotateCcw } from 'lucide-react';
import { Progress } from './ui/progress';
import { getAdaptiveProgress } from '../utils/progress';

interface HistoryItem {
  id: string;
  item: string;
  score: number;
  xpGained: number;
  analyzedAt: Date;
}

interface ItemHistoryProps {
  history: HistoryItem[];
  onReanalyze: (item: string) => void;
  onClearHistory: () => void;
}

export function ItemHistory({ history, onReanalyze, onClearHistory }: ItemHistoryProps) {
  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 4) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    if (score <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 2) return 'Excellent';
    if (score <= 4) return 'Good';
    if (score <= 6) return 'Moderate';
    if (score <= 8) return 'Poor';
    return 'Terrible';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Analysis History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No analysis history yet</h3>
            <p className="text-muted-foreground">
              Start analyzing items to build your environmental impact history
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Analysis History</span>
              <Badge variant="outline">{history.length} items</Badge>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium capitalize">{item.item}</h4>
                    <Badge 
                      variant="outline" 
                      className={getScoreColor(item.score)}
                    >
                      {getScoreLabel(item.score)}
                    </Badge>
                    <Badge 
                      variant={item.xpGained > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {item.xpGained > 0 ? '+' : ''}{item.xpGained} XP
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Impact Score</span>
                        <span className={`font-medium ${getScoreColor(item.score)}`}>
                          {item.score.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress 
                        value={getAdaptiveProgress(item.score).value} 
                        className={`h-1 ${getAdaptiveProgress(item.score).className}`}
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDate(item.analyzedAt)}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReanalyze(item.item)}
                  className="ml-4"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}