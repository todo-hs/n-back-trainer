import { create } from 'zustand';
import { TrainingState, Stimulus, Response, SessionStats } from '../types';

interface TrainingStore extends TrainingState {
  // Actions
  startSession: (nLevel: number, mode: 'fixed' | 'adaptive') => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  
  // Stimulus management
  generateStimuli: (count: number, nLevel: number) => void;
  setCurrentStimulus: (stimulus: Stimulus | undefined) => void;
  
  // Response handling
  registerResponse: (type: 'visual' | 'audio') => void;
  
  // Stats
  getSessionStats: () => SessionStats;
  
  // N-level adaptation
  updateNLevel: (newLevel: number) => void;
}

const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split(''); // Removed I to avoid confusion

export const useTrainingStore = create<TrainingStore>((set, get) => ({
  // Initial state
  isRunning: false,
  isPaused: false,
  currentTrialIndex: 0,
  nLevel: 2,
  mode: 'fixed',
  stimuli: [],
  responses: [],
  currentStimulus: undefined,

  // Actions
  startSession: (nLevel, mode) => {
    const { generateStimuli } = get();
    generateStimuli(40, nLevel); // 20 + 20 trials as per spec
    set({
      isRunning: true,
      isPaused: false,
      currentTrialIndex: 0,
      nLevel,
      mode,
      responses: [],
    });
  },

  pauseSession: () => set({ isPaused: true }),
  
  resumeSession: () => set({ isPaused: false }),
  
  endSession: () => set({
    isRunning: false,
    isPaused: false,
    currentStimulus: undefined,
  }),

  generateStimuli: (count, nLevel) => {
    const stimuli: Stimulus[] = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < count; i++) {
      const position = Math.floor(Math.random() * 9);
      const letter = letters[Math.floor(Math.random() * letters.length)];
      
      // Ensure N-back matches for ~30% of trials
      if (i >= nLevel && Math.random() < 0.3) {
        const nBackStimulus = stimuli[i - nLevel];
        if (Math.random() < 0.5) {
          // Visual match
          stimuli.push({
            position: nBackStimulus.position,
            letter,
            timestamp: timestamp + i * 1000,
          });
        } else {
          // Audio match
          stimuli.push({
            position,
            letter: nBackStimulus.letter,
            timestamp: timestamp + i * 1000,
          });
        }
      } else {
        stimuli.push({
          position,
          letter,
          timestamp: timestamp + i * 1000,
        });
      }
    }
    
    set({ stimuli });
  },

  setCurrentStimulus: (stimulus) => set({ currentStimulus: stimulus }),

  registerResponse: (type) => {
    const { currentStimulus, stimuli, currentTrialIndex, nLevel, responses } = get();
    if (!currentStimulus || currentTrialIndex < nLevel) return;
    
    const nBackStimulus = stimuli[currentTrialIndex - nLevel];
    const isCorrect = type === 'visual' 
      ? currentStimulus.position === nBackStimulus.position
      : currentStimulus.letter === nBackStimulus.letter;
    
    const response: Response = {
      type,
      correct: isCorrect,
      reactionTime: Date.now() - currentStimulus.timestamp,
      timestamp: Date.now(),
    };
    
    set({ responses: [...responses, response] });
  },

  getSessionStats: () => {
    const { responses, nLevel, mode, stimuli, currentTrialIndex } = get();
    
    const visualResponses = responses.filter(r => r.type === 'visual');
    const audioResponses = responses.filter(r => r.type === 'audio');
    
    const stats: SessionStats = {
      nLevel,
      mode,
      visualHits: visualResponses.filter(r => r.correct).length,
      visualMisses: 0, // TODO: Calculate based on expected responses
      visualFalseAlarms: visualResponses.filter(r => !r.correct).length,
      audioHits: audioResponses.filter(r => r.correct).length,
      audioMisses: 0, // TODO: Calculate based on expected responses
      audioFalseAlarms: audioResponses.filter(r => !r.correct).length,
      averageReactionTime: responses.length > 0
        ? responses.reduce((sum, r) => sum + r.reactionTime, 0) / responses.length
        : 0,
      startedAt: new Date(stimuli[0]?.timestamp || Date.now()),
      finishedAt: currentTrialIndex >= stimuli.length - 1 ? new Date() : undefined,
    };
    
    return stats;
  },

  updateNLevel: (newLevel) => set({ nLevel: newLevel }),
}));