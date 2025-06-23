import { useEffect, useRef, useCallback } from 'react';
import { useTrainingStore } from '../store/trainingStore';
import { useSettingsStore } from '../store/settingsStore';
import * as Haptics from 'expo-haptics';

export function useTraining() {
  const {
    isRunning,
    isPaused,
    currentTrialIndex,
    stimuli,
    setCurrentStimulus,
    registerResponse,
    updateNLevel,
    mode,
    responses,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
  } = useTrainingStore();
  
  const { settings } = useSettingsStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const responseWindowRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adaptive algorithm logic
  const checkAdaptation = useCallback(() => {
    if (mode !== 'adaptive' || responses.length < 8) return;
    
    // Get last 8 responses
    const recentResponses = responses.slice(-8);
    const hitRate = recentResponses.filter(r => r.correct).length / 8;
    
    const currentNLevel = useTrainingStore.getState().nLevel;
    
    if (hitRate >= 0.8 && currentNLevel < 9) {
      updateNLevel(currentNLevel + 1);
    } else if (hitRate <= 0.5 && currentNLevel > 1) {
      updateNLevel(currentNLevel - 1);
    }
  }, [mode, responses, updateNLevel]);

  // Main training loop
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const runTrial = () => {
      if (currentTrialIndex >= stimuli.length) {
        endSession();
        return;
      }

      const stimulus = stimuli[currentTrialIndex];
      setCurrentStimulus(stimulus);

      // Clear previous response window
      if (responseWindowRef.current) {
        clearTimeout(responseWindowRef.current);
      }

      // Set response window timeout
      responseWindowRef.current = setTimeout(() => {
        setCurrentStimulus(undefined);
        const nextIndex = currentTrialIndex + 1;
        useTrainingStore.setState({ currentTrialIndex: nextIndex });
        checkAdaptation();
        
        // Schedule next trial
        if (nextIndex < stimuli.length) {
          setTimeout(() => {
            if (useTrainingStore.getState().isRunning && !useTrainingStore.getState().isPaused) {
              runTrial();
            }
          }, 500); // 500ms pause between trials
        }
      }, settings.responseWindow);
    };

    // Initial trial
    runTrial();

    // Don't set up interval, rely on timeout chain instead
    // intervalRef.current = setInterval(() => {
    //   runTrial();
    // }, settings.stimulusDuration + settings.responseWindow);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (responseWindowRef.current) {
        clearTimeout(responseWindowRef.current);
      }
    };
  }, [
    isRunning,
    isPaused,
    currentTrialIndex,
    stimuli.length,
    settings.responseWindow,
    setCurrentStimulus,
    endSession,
    checkAdaptation,
  ]);

  const handleResponse = useCallback(async (type: 'visual' | 'audio') => {
    if (!isRunning || isPaused) return;
    
    registerResponse(type);
    
    // Haptic feedback if enabled
    if (settings.vibrationEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isRunning, isPaused, registerResponse, settings.vibrationEnabled]);

  const currentStimulus = useTrainingStore((state) => state.currentStimulus);
  const currentNLevel = useTrainingStore((state) => state.nLevel);

  return {
    isRunning,
    isPaused,
    currentTrialIndex,
    totalTrials: stimuli.length,
    currentStimulus,
    nLevel: currentNLevel,
    handleVisualResponse: () => handleResponse('visual'),
    handleAudioResponse: () => handleResponse('audio'),
    startSession,
    pauseSession,
    resumeSession,
    endSession,
  };
}