import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Recycle, Factory, Truck, Home, Trash2, Droplets, Flame, Clock, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAdaptiveProgress } from '../utils/progress';

interface EnhancedAnalysisData {
  item: string;
  sustainabilityScore: number;
  carbonFootprint: number;
  waterUsage: number;
  landfillTime: number;
  recyclability: number;
  stages: {
    rawMaterials: { score: number; impact: string };
    production: { score: number; impact: string };
    transportation: { score: number; impact: string };
    usage: { score: number; impact: string };
    disposal: { score: number; impact: string };
  };
  description: string;
  xpGained: number;
  confidence: string;
  dataSources: string;
}

interface ItemAnalysisProps {
  analysisData: EnhancedAnalysisData;
  onAnalysisComplete?: (xpGained: number) => void;
}

export function ItemAnalysis({ analysisData, onAnalysisComplete }: ItemAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score <= 2) return { 
      bg: 'bg-green-500', 
      text: 'text-green-700 dark:text-green-400', 
      label: 'Excellent',
      progressColor: '[&>[data-progress]]:bg-green-500'
    };
    if (score <= 4) return { 
      bg: 'bg-green-400', 
      text: 'text-green-600 dark:text-green-300', 
      label: 'Good',
      progressColor: '[&>[data-progress]]:bg-green-400'
    };
    if (score <= 6) return { 
      bg: 'bg-yellow-500', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      label: 'Moderate',
      progressColor: '[&>[data-progress]]:bg-yellow-500'
    };
    if (score <= 8) return { 
      bg: 'bg-orange-500', 
      text: 'text-orange-600 dark:text-orange-400', 
      label: 'Poor',
      progressColor: '[&>[data-progress]]:bg-orange-500'
    };
    return { 
      bg: 'bg-red-500', 
      text: 'text-red-600 dark:text-red-400', 
      label: 'Terrible',
      progressColor: '[&>[data-progress]]:bg-red-500'
    };
  };

  const getOverallColor = (score: number) => {
    if (score <= 2) return 'text-green-600 dark:text-green-400';
    if (score <= 4) return 'text-green-500 dark:text-green-300';
    if (score <= 6) return 'text-yellow-500 dark:text-yellow-400';
    if (score <= 8) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getRatingEmoji = (score: number) => {
    if (score <= 2) return '🟢';
    if (score <= 4) return '🟡';
    if (score <= 6) return '🟠';
    if (score <= 8) return '🔴';
    return '🔴';
  };

  const overallColor = getOverallColor(analysisData.sustainabilityScore);
  const overallRating = getScoreColor(analysisData.sustainabilityScore);

  const stageData = [
    { name: 'Raw Materials', data: analysisData.stages.rawMaterials, icon: Recycle },
    { name: 'Production', data: analysisData.stages.production, icon: Factory },
    { name: 'Transportation', data: analysisData.stages.transportation, icon: Truck },
    { name: 'Usage', data: analysisData.stages.usage, icon: Home },
    { name: 'Disposal', data: analysisData.stages.disposal, icon: Trash2 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overall Score Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Environmental Impact: {analysisData.item}</span>
            <Badge variant={analysisData.xpGained > 0 ? "default" : "destructive"} className="text-lg px-3 py-1">
              {analysisData.xpGained > 0 ? '+' : ''}{analysisData.xpGained} XP
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Score */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-4xl">{getRatingEmoji(analysisData.sustainabilityScore)}</span>
                <div>
                  <div className={`text-4xl font-bold ${overallColor}`}>
                    {analysisData.sustainabilityScore.toFixed(1)}/10
                  </div>
                  <Badge variant="outline" className={overallRating.text}>
                    {overallRating.label}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={analysisData.sustainabilityScore * 10} 
                className={`h-4 ${overallRating.progressColor}`}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>🌱 Eco-friendly (Low Impact)</span>
                <span>💀 Harmful (High Impact)</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Flame className="h-5 w-5 mx-auto mb-1 text-red-500" />
                <div className="text-sm font-medium">Carbon Footprint</div>
                <div className="text-lg font-bold text-red-600">
                  {analysisData.carbonFootprint} kg CO₂
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <div className="text-sm font-medium">Water Usage</div>
                <div className="text-lg font-bold text-blue-600">
                  {analysisData.waterUsage.toLocaleString()} L
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                <div className="text-sm font-medium">Landfill Time</div>
                <div className="text-lg font-bold text-orange-600">
                  {analysisData.landfillTime} years
                </div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <RotateCcw className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <div className="text-sm font-medium">Recyclable</div>
                <div className="text-lg font-bold text-green-600">
                  {analysisData.recyclability}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stageData.map((stage, index) => {
          const Icon = stage.icon;
          const stageColor = getScoreColor(stage.data.score);
          
          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{stage.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={stageColor.text}>
                      {stage.data.impact}
                    </Badge>
                    <span className={`font-bold ${stageColor.text}`}>
                      {stage.data.score.toFixed(1)}/10
                    </span>
                  </div>
                  <Progress 
                    value={stage.data.score * 10}
                    className={`h-3 ${stageColor.progressColor}`}
                  />
                  <div className="text-xs text-muted-foreground">
                    Impact Level: {stage.data.impact}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Description */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {analysisData.description}
            </div>
            <div className="flex items-center justify-between text-sm border-t pt-4">
              <div className="flex items-center space-x-4">
                <span>🤖 AI Analysis Confidence: <strong>{analysisData.confidence}</strong></span>
                <span>📚 Data Sources: {analysisData.dataSources}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}