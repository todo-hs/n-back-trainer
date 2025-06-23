import { Response } from '../types';

export interface AdaptiveState {
  currentNLevel: number;
  responseHistory: Response[];
  lastEvaluationIndex: number;
}

export function evaluateAdaptation(
  responses: Response[],
  currentNLevel: number,
  windowSize: number = 8,
  threshold: { increase: number; decrease: number } = { increase: 0.8, decrease: 0.5 }
): { shouldAdapt: boolean; newLevel: number; reason: string } {
  
  if (responses.length < windowSize) {
    return {
      shouldAdapt: false,
      newLevel: currentNLevel,
      reason: 'Insufficient response data'
    };
  }

  // Get the last windowSize responses
  const recentResponses = responses.slice(-windowSize);
  
  // Calculate hit rate for recent responses
  const correctResponses = recentResponses.filter(r => r.correct).length;
  const hitRate = correctResponses / windowSize;
  
  // Determine if adaptation is needed
  if (hitRate >= threshold.increase && currentNLevel < 9) {
    return {
      shouldAdapt: true,
      newLevel: currentNLevel + 1,
      reason: `Hit rate ${(hitRate * 100).toFixed(1)}% >= ${(threshold.increase * 100)}%`
    };
  } else if (hitRate <= threshold.decrease && currentNLevel > 1) {
    return {
      shouldAdapt: true,
      newLevel: currentNLevel - 1,
      reason: `Hit rate ${(hitRate * 100).toFixed(1)}% <= ${(threshold.decrease * 100)}%`
    };
  }
  
  return {
    shouldAdapt: false,
    newLevel: currentNLevel,
    reason: `Hit rate ${(hitRate * 100).toFixed(1)}% within acceptable range`
  };
}

export function calculateSessionMetrics(responses: Response[]): {
  overallAccuracy: number;
  visualAccuracy: number;
  audioAccuracy: number;
  averageReactionTime: number;
  recentAccuracy: number; // Last 8 responses
} {
  if (responses.length === 0) {
    return {
      overallAccuracy: 0,
      visualAccuracy: 0,
      audioAccuracy: 0,
      averageReactionTime: 0,
      recentAccuracy: 0,
    };
  }
  
  const visualResponses = responses.filter(r => r.type === 'visual');
  const audioResponses = responses.filter(r => r.type === 'audio');
  
  const overallCorrect = responses.filter(r => r.correct).length;
  const visualCorrect = visualResponses.filter(r => r.correct).length;
  const audioCorrect = audioResponses.filter(r => r.correct).length;
  
  const totalReactionTime = responses.reduce((sum, r) => sum + r.reactionTime, 0);
  
  const recentResponses = responses.slice(-8);
  const recentCorrect = recentResponses.filter(r => r.correct).length;
  
  return {
    overallAccuracy: (overallCorrect / responses.length) * 100,
    visualAccuracy: visualResponses.length > 0 ? (visualCorrect / visualResponses.length) * 100 : 0,
    audioAccuracy: audioResponses.length > 0 ? (audioCorrect / audioResponses.length) * 100 : 0,
    averageReactionTime: totalReactionTime / responses.length,
    recentAccuracy: recentResponses.length > 0 ? (recentCorrect / recentResponses.length) * 100 : 0,
  };
}