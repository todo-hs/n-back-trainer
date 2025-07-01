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
  id: string; // Unique session ID
  nLevel: number;
  mode: 'fixed' | 'adaptive';
  visualHits: number;
  visualMisses: number;
  visualFalseAlarms: number;
  audioHits: number;
  audioMisses: number;
  audioFalseAlarms: number;
  averageReactionTime: number;
  accuracy: number; // Overall accuracy percentage
  duration: number; // Session duration in seconds
  startedAt: Date;
  finishedAt: Date;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'; // Time period classification
}

export interface UserSettings {
  initialN: number;
  fixedN: number; // Fixed training N-level
  adaptiveN: number; // Persistent adaptive N-level
  lastLevelUpDate: string | null; // Track last level up date
  dailyCheckDate: string | null; // Track daily level check
  trialCount: number;
  stimulusDuration: number;
  responseWindow: number;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'en' | 'ja';
  isPremium: boolean; // Premium subscription status
  showLetters: boolean; // Show/hide letters during audio stimulus
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