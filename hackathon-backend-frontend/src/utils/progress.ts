// Utility functions for adaptive progress bars with environmental impact colors

export interface ProgressConfig {
  value: number;
  className: string;
  barColor: string;
  textColor: string;
  label: string;
}

/**
 * Get adaptive progress configuration based on environmental impact score
 * Higher scores = worse environmental impact = red/orange colors
 * Lower scores = better environmental impact = green colors
 */
export const getAdaptiveProgress = (score: number, isInverted = false): ProgressConfig => {
  // For environmental impact: lower scores are better (green), higher scores are worse (red)
  const normalizedScore = isInverted ? (10 - score) : score;
  const progressValue = (normalizedScore / 10) * 100;

  if (score <= 2) {
    return {
      value: progressValue,
      className: '[&>[data-progress]]:bg-green-500',
      barColor: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      label: 'Excellent'
    };
  }
  
  if (score <= 4) {
    return {
      value: progressValue,
      className: '[&>[data-progress]]:bg-green-400',
      barColor: 'bg-green-400',
      textColor: 'text-green-500 dark:text-green-300',
      label: 'Good'
    };
  }
  
  if (score <= 6) {
    return {
      value: progressValue,
      className: '[&>[data-progress]]:bg-yellow-500',
      barColor: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      label: 'Moderate'
    };
  }
  
  if (score <= 8) {
    return {
      value: progressValue,
      className: '[&>[data-progress]]:bg-orange-500',
      barColor: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      label: 'Poor'
    };
  }
  
  return {
    value: progressValue,
    className: '[&>[data-progress]]:bg-red-500',
    barColor: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    label: 'Terrible'
  };
};

/**
 * Get adaptive progress for sustainability rate (inverted logic)
 * Higher percentages = better = green colors
 */
export const getSustainabilityProgress = (rate: number): ProgressConfig => {
  if (rate >= 90) {
    return {
      value: rate,
      className: '[&>[data-progress]]:bg-green-500',
      barColor: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      label: 'Excellent'
    };
  }
  
  if (rate >= 70) {
    return {
      value: rate,
      className: '[&>[data-progress]]:bg-green-400',
      barColor: 'bg-green-400',
      textColor: 'text-green-500 dark:text-green-300',
      label: 'Good'
    };
  }
  
  if (rate >= 50) {
    return {
      value: rate,
      className: '[&>[data-progress]]:bg-yellow-500',
      barColor: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      label: 'Moderate'
    };
  }
  
  if (rate >= 30) {
    return {
      value: rate,
      className: '[&>[data-progress]]:bg-orange-500',
      barColor: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      label: 'Poor'
    };
  }
  
  return {
    value: rate,
    className: '[&>[data-progress]]:bg-red-500',
    barColor: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    label: 'Critical'
  };
};