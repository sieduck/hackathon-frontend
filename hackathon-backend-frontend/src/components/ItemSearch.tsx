import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

interface ItemSearchProps {
  onSearch: (item: string) => Promise<void>;
  userLevel: number;
  userXP: number;
  xpToNextLevel: number;
}

export function ItemSearch({ onSearch, userLevel, userXP, xpToNextLevel }: ItemSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      await onSearch(searchTerm.trim());
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const suggestions = [
    'iPhone', 'Avocado', 'T-shirt', 'Laptop', 'Coffee Cup', 
    'Plastic Bottle', 'Bicycle', 'LED Bulb', 'Jeans', 'Banana'
  ];

  const xpPercentage = ((userXP % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* User Level & XP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="default" className="text-lg px-3 py-1">
                  Level {userLevel}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {userXP} XP
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {xpToNextLevel} XP to next level
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze Environmental Impact</CardTitle>
          <p className="text-muted-foreground">
            Enter any item to discover its environmental footprint across its lifecycle
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter an item (e.g., iPhone, avocado, t-shirt)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!searchTerm.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          
          {/* Suggestions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try these popular items:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(suggestion)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}