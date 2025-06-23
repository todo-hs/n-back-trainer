export interface Stimulus {
  position: number; // 0-8 for 3x3 grid
  letter: string; // A-Z
  timestamp: number;
}

export interface Response {
  type: 'visual' | 'audio';
  correct: boolean;
  reactionTime: number;
  timestamp: number;
}

export interface SessionStats {
  nLevel: number;
  mode: 'fixed' | 'adaptive';
  visualHits: number;
  visualMisses: number;
  visualFalseAlarms: number;
  audioHits: number;
  audioMisses: number;
  audioFalseAlarms: number;
  averageReactionTime: number;
  startedAt: Date;
  finishedAt?: Date;
}

export interface UserSettings {
  initialN: number;
  fixedN: number; // Fixed training N-level
  trialCount: number;
  stimulusDuration: number;
  responseWindow: number;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'en' | 'ja';
  isPremium: boolean; // Premium subscription status
}

export interface TrainingState {
  isRunning: boolean;
  isPaused: boolean;
  currentTrialIndex: number;
  nLevel: number;
  mode: 'fixed' | 'adaptive';
  stimuli: Stimulus[];
  responses: Response[];
  currentStimulus?: Stimulus;
}