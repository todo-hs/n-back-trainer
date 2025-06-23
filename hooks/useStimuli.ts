import { useMemo } from 'react';
import { Stimulus } from '../types';

export function useStimuli(count: number, nLevel: number, targetHitRate: number = 0.3) {
  const stimuli = useMemo(() => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
    const generated: Stimulus[] = [];
    const timestamp = Date.now();
    
    // Track planned matches
    const visualMatches = new Set<number>();
    const audioMatches = new Set<number>();
    
    // Randomly distribute matches throughout the session
    for (let i = nLevel; i < count; i++) {
      if (Math.random() < targetHitRate / 2) {
        visualMatches.add(i);
      }
      if (Math.random() < targetHitRate / 2) {
        audioMatches.add(i);
      }
    }
    
    for (let i = 0; i < count; i++) {
      let position = Math.floor(Math.random() * 9);
      let letter = letters[Math.floor(Math.random() * letters.length)];
      
      // Apply planned matches
      if (i >= nLevel) {
        const nBackStimulus = generated[i - nLevel];
        
        if (visualMatches.has(i)) {
          position = nBackStimulus.position;
        }
        if (audioMatches.has(i)) {
          letter = nBackStimulus.letter;
        }
      }
      
      generated.push({
        position,
        letter,
        timestamp: timestamp + i * 1000,
      });
    }
    
    return generated;
  }, [count, nLevel, targetHitRate]);
  
  return stimuli;
}