import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  updateAdaptiveLevel: (newLevel: number) => void;
  checkDailyLevelDecrease: () => void;
}

const defaultSettings: UserSettings = {
  initialN: 2,
  fixedN: 2, // Default fixed N-level
  adaptiveN: 2, // Persistent adaptive N-level
  lastLevelUpDate: null, // Track last level up date
  dailyCheckDate: null, // Track daily level check
  trialCount: 20,
  stimulusDuration: 1000,
  responseWindow: 1000,
  theme: 'dark',
  soundEnabled: true, // Always enabled
  vibrationEnabled: true,
  language: 'ja', // Default to Japanese
  isPremium: false, // Default to free user
  showLetters: true, // Default to showing letters
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { 
            ...state.settings, 
            ...newSettings,
            soundEnabled: true // Always keep sound enabled
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
      updateAdaptiveLevel: (newLevel) => {
        const today = new Date().toDateString();
        set((state) => ({
          settings: {
            ...state.settings,
            adaptiveN: newLevel,
            lastLevelUpDate: today,
            dailyCheckDate: today,
          },
        }));
      },
      checkDailyLevelDecrease: () => {
        const today = new Date().toDateString();
        const { settings } = get();
        
        // If it's a new day and no level up yesterday, decrease by 1
        if (settings.dailyCheckDate && settings.dailyCheckDate !== today) {
          const lastCheck = new Date(settings.dailyCheckDate);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastCheck.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff >= 1 && settings.lastLevelUpDate !== settings.dailyCheckDate) {
            const newLevel = Math.max(1, settings.adaptiveN - 1);
            set((state) => ({
              settings: {
                ...state.settings,
                adaptiveN: newLevel,
                dailyCheckDate: today,
              },
            }));
          } else {
            // Just update the check date
            set((state) => ({
              settings: {
                ...state.settings,
                dailyCheckDate: today,
              },
            }));
          }
        } else if (!settings.dailyCheckDate) {
          // First time, just set the date
          set((state) => ({
            settings: {
              ...state.settings,
              dailyCheckDate: today,
            },
          }));
        }
      },
    }),
    {
      name: 'n-back-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);