import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

interface SettingsState {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  initialN: 2,
  fixedN: 2, // Default fixed N-level
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
    (set) => ({
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
    }),
    {
      name: 'n-back-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);