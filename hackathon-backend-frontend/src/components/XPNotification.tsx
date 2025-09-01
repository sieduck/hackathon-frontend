import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, TrendingUp, Trophy, Star } from 'lucide-react';

interface XPNotificationProps {
  xpGained: number;
  levelUp?: boolean;
  newLevel?: number;
  show: boolean;
  onComplete: () => void;
}

export function XPNotification({ xpGained, levelUp, newLevel, show, onComplete }: XPNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 300); // Wait for exit animation
      }, levelUp ? 4000 : 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, levelUp, onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed top-20 right-4 z-50 pointer-events-none"
        >
          <Card className="border-2 border-primary bg-card/95 backdrop-blur-sm shadow-lg">
            <div className="p-4 space-y-3">
              {levelUp ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-center space-y-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="flex justify-center"
                  >
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </motion.div>
                  <h3 className="font-bold text-primary">Level Up!</h3>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    Level {newLevel}
                  </Badge>
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      +{xpGained} XP
                    </span>
                  </div>
                  <motion.div
                    className="flex justify-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                      >
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.6 }}
                    className={`p-2 rounded-full ${
                      xpGained > 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                    }`}
                  >
                    {xpGained > 0 ? (
                      <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400 rotate-180" />
                    )}
                  </motion.div>
                  <div>
                    <p className="font-medium">
                      {xpGained > 0 ? 'XP Gained!' : 'XP Lost'}
                    </p>
                    <motion.p
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`text-lg font-bold ${
                        xpGained > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {xpGained > 0 ? '+' : ''}{xpGained} XP
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating animation for individual XP particles
export function XPParticles({ show, count = 5 }: { show: boolean; count?: number }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
            y: window.innerHeight / 2 - Math.random() * 300,
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
          className="absolute"
        >
          <Sparkles className="h-6 w-6 text-yellow-400 fill-current" />
        </motion.div>
      ))}
    </div>
  );
}