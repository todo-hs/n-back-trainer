import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Animated, Vibration } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/settingsStore';
import { useStatsStore } from '@/store/statsStore';
import { useTranslations } from '@/utils/i18n';

// Types
interface Trial {
  position: number;
  letter: string;
}

export default function FixedTrainingScreen() {
  const { settings } = useSettingsStore();
  const { addSession } = useStatsStore();
  const t = useTranslations(settings.language);
  const N_LEVEL = settings.fixedN; // Use selected fixed N-level from settings
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(null);
  const [currentLetter, setCurrentLetter] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showingStimulus, setShowingStimulus] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  // Response tracking
  const [visualHits, setVisualHits] = useState<boolean[]>([]);
  const [audioHits, setAudioHits] = useState<boolean[]>([]);
  const [canRespond, setCanRespond] = useState(false);
  const [buttonsPressed, setButtonsPressed] = useState<{visual: boolean, audio: boolean}>({visual: false, audio: false});
  
  // Animation values
  const cellScale = useRef(new Animated.Value(1)).current;
  const responseAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants
  const STIMULUS_DURATION = 800; // 800ms to show stimulus
  const INTER_STIMULUS_INTERVAL = 3000; // Total time per trial (3 seconds)
  const TOTAL_TRIALS = 20;
  // Optimal letter count based on N-level for effective training
  const getOptimalLetters = (nLevel: number) => {
    const optimalCount = Math.max(3, Math.min(8, nLevel + 2)); // N+2 letters, min 3, max 8
    return 'ABCDEFGH'.slice(0, optimalCount).split('');
  };
  
  const LETTERS = getOptimalLetters(N_LEVEL);

  // Generate trials with optimal training algorithm
  const generateTrials = (n: number, totalTrials: number) => {
    const newTrials: Trial[] = [];
    const letters = getOptimalLetters(n);
    
    // 8 positions excluding center (position 4) in 3x3 grid
    const validPositions = [0, 1, 2, 3, 5, 6, 7, 8]; // Skip center position 4
    
    // Target 40% match rate for effective training
    const targetMatches = Math.floor(totalTrials * 0.4);
    let plannedMatches = 0;
    
    for (let i = 0; i < totalTrials; i++) {
      const remainingTrials = totalTrials - i;
      const remainingMatches = targetMatches - plannedMatches;
      const shouldCreateMatch = i >= n && remainingMatches > 0 && 
        (remainingMatches >= remainingTrials * 0.8 || Math.random() < 0.5);
      
      if (shouldCreateMatch) {
        // Create an N-back match (50/50 position vs letter)
        const matchType = Math.random() < 0.5 ? 'position' : 'letter';
        const nBackTrial = newTrials[i - n];
        
        if (matchType === 'position') {
          newTrials.push({
            position: nBackTrial.position,
            letter: letters[Math.floor(Math.random() * letters.length)]
          });
        } else {
          newTrials.push({
            position: validPositions[Math.floor(Math.random() * validPositions.length)],
            letter: nBackTrial.letter
          });
        }
        plannedMatches++;
      } else {
        // Random trial (avoid accidental matches)
        let position, letter;
        let attempts = 0;
        do {
          position = validPositions[Math.floor(Math.random() * validPositions.length)];
          letter = letters[Math.floor(Math.random() * letters.length)];
          attempts++;
        } while (attempts < 10 && i >= n && 
                (newTrials[i - n].position === position || newTrials[i - n].letter === letter));
        
        newTrials.push({ position, letter });
      }
    }
    
    return newTrials;
  };

  // Animation helpers - removed cell animation
  const animateCell = () => {
    // No cell animation anymore
  };

  const animateResponse = (isCorrect: boolean) => {
    // Remove response animation to prevent layout shifts
  };


  // Auto-start with delay when component mounts
  // Initialize game when screen comes into focus (including first load and returning from back button)
  useFocusEffect(
    useCallback(() => {
      console.log('Fixed mode: Screen focused, initializing game...');
      
      // Clear any existing timeouts first
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Force reset all states when screen is focused
      setIsRunning(false);
      setCurrentTrial(0);
      setTrials([]);
      setScore({ correct: 0, total: 0 });
      setVisualHits([]);
      setAudioHits([]);
      setSessionStartTime(null);
      setHighlightPosition(null);
      setCurrentLetter('');
      setShowingStimulus(false);
      setCanRespond(false);
      setButtonsPressed({visual: false, audio: false});
      
      // Reset animations
      progressAnimation.setValue(0);
      responseAnimation.setValue(0);
      cellScale.setValue(1);

      // Start a new game after delay
      const startDelay = setTimeout(() => {
        console.log('Fixed mode: Starting new game...');
        
        // Generate new trials
        const newTrials = generateTrials(N_LEVEL, TOTAL_TRIALS);
        
        // Set initial state
        setTrials(newTrials);
        setCurrentTrial(0);
        setScore({ correct: 0, total: 0 });
        setVisualHits([]);
        setAudioHits([]);
        setSessionStartTime(new Date());
        setHighlightPosition(null);
        setCurrentLetter('');
        setShowingStimulus(false);
        setCanRespond(false);
        setButtonsPressed({visual: false, audio: false});
        setIsRunning(true); // Start the game
        
        console.log('Fixed mode: Game started with', newTrials.length, 'trials');
        
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 3000);

      return () => {
        console.log('Fixed mode: Cleaning up focus effect...');
        clearTimeout(startDelay);
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [])
  );

  // Main game loop
  useEffect(() => {
    if (!isRunning || currentTrial >= trials.length) {
      if (isRunning && currentTrial >= trials.length) {
        // Game finished
        endGame();
      }
      return;
    }

    const trial = trials[currentTrial];
    
    // Show stimulus
    setShowingStimulus(true);
    setHighlightPosition(trial.position);
    setCurrentLetter(trial.letter);
    setCanRespond(currentTrial >= N_LEVEL); // Can only respond after N trials
    
    // Animate cell highlight
    animateCell();
    
    // Update progress animation
    const progress = (currentTrial + 1) / trials.length;
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    // Haptic feedback for stimulus
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Speak the letter without "capital" prefix
    Speech.speak(trial.letter.toLowerCase(), {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.6, // Slower speech rate for clarity
    });
    
    // Hide stimulus after duration
    const hideTimeout = setTimeout(() => {
      setShowingStimulus(false);
      setHighlightPosition(null);
    }, STIMULUS_DURATION);
    
    // Move to next trial
    intervalRef.current = setTimeout(() => {
      setCurrentTrial(currentTrial + 1);
      // Reset button states for next trial
      setButtonsPressed({visual: false, audio: false});
    }, INTER_STIMULUS_INTERVAL);
    
    return () => {
      clearTimeout(hideTimeout);
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isRunning, currentTrial, trials, N_LEVEL]);

  // Handle responses
  const handleVisualResponse = () => {
    if (!canRespond || !isRunning || currentTrial >= trials.length) return;
    
    // Visual feedback for button press
    setButtonsPressed(prev => ({...prev, visual: true}));
    
    const currentTrialData = trials[currentTrial];
    const nBackTrial = trials[currentTrial - N_LEVEL];
    const isCorrect = currentTrialData.position === nBackTrial.position;
    
    const newVisualHits = [...visualHits];
    newVisualHits[currentTrial] = true;
    setVisualHits(newVisualHits);
    
    // Enhanced feedback (no score tracking here anymore)
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateResponse(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      animateResponse(false);
      // Vibration pattern for error
      Vibration.vibrate([100, 50, 100]);
    }
  };

  const handleAudioResponse = () => {
    if (!canRespond || !isRunning || currentTrial >= trials.length) return;
    
    // Visual feedback for button press
    setButtonsPressed(prev => ({...prev, audio: true}));
    
    const currentTrialData = trials[currentTrial];
    const nBackTrial = trials[currentTrial - N_LEVEL];
    const isCorrect = currentTrialData.letter === nBackTrial.letter;
    
    const newAudioHits = [...audioHits];
    newAudioHits[currentTrial] = true;
    setAudioHits(newAudioHits);
    
    // Enhanced feedback (no score tracking here anymore)
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateResponse(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      animateResponse(false);
      // Vibration pattern for error
      Vibration.vibrate([100, 50, 100]);
    }
  };

  // End game
  const endGame = () => {
    setIsRunning(false);
    const endTime = new Date();
    const accuracy = score.total > 0 ? (score.correct / score.total * 100) : 0;
    
    // Save session data
    if (sessionStartTime && score.total > 0) {
      const duration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / 1000);
      const visualCorrect = visualHits.filter((hit, index) => {
        if (index < N_LEVEL || !hit) return false;
        const currentTrialData = trials[index];
        const nBackTrial = trials[index - N_LEVEL];
        return currentTrialData.position === nBackTrial.position;
      }).length;
      const audioCorrect = audioHits.filter((hit, index) => {
        if (index < N_LEVEL || !hit) return false;
        const currentTrialData = trials[index];
        const nBackTrial = trials[index - N_LEVEL];
        return currentTrialData.letter === nBackTrial.letter;
      }).length;
      
      addSession({
        nLevel: N_LEVEL,
        mode: 'fixed',
        visualHits: visualHitsCount,
        visualMisses: visualMissesCount,
        visualFalseAlarms: visualFalseAlarmsCount,
        audioHits: audioHitsCount,
        audioMisses: audioMissesCount,
        audioFalseAlarms: audioFalseAlarmsCount,
        averageReactionTime: 0, // Could be implemented with reaction time tracking
        accuracy: Math.round(overallAccuracy),
        duration,
        startedAt: sessionStartTime,
        finishedAt: endTime,
      });
    }
    
    // Create detailed result message
    const resultMessage = 
      `${t.training.accuracy}: ${overallAccuracy.toFixed(1)}%\n\n` +
      `Visual: ${visualAccuracy.toFixed(1)}%\n` +
      `${t.training.correct}: ${visualCorrectTotal}/${validTrials}\n\n` +
      `Audio: ${audioAccuracy.toFixed(1)}%\n` +
      `${t.training.correct}: ${audioCorrectTotal}/${validTrials}`;
    
    Alert.alert(
      t.training.sessionComplete,
      resultMessage,
      [
        { text: t.training.continue, onPress: () => {
          // Restart game
          const newTrials = generateTrials(N_LEVEL, TOTAL_TRIALS);
          setTrials(newTrials);
          setCurrentTrial(0);
          setScore({ correct: 0, total: 0 });
          setVisualHits([]);
          setAudioHits([]);
          setSessionStartTime(new Date());
          setIsRunning(true);
        } },
        { text: t.training.backToHome, onPress: () => router.replace('/') }
      ]
    );
  };

  const handleBackToHome = () => {
    // Complete reset - same as component mount reset
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset all states completely
    setIsRunning(false);
    setCurrentTrial(0);
    setTrials([]);
    setScore({ correct: 0, total: 0 });
    setVisualHits([]);
    setAudioHits([]);
    setSessionStartTime(null);
    setHighlightPosition(null);
    setCurrentLetter('');
    setShowingStimulus(false);
    setCanRespond(false);
    setButtonsPressed({visual: false, audio: false});
    
    // Reset animations
    progressAnimation.setValue(0);
    responseAnimation.setValue(0);
    cellScale.setValue(1);
    
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backArrowHeader} onPress={handleBackToHome}>
        <Text style={styles.backArrowText}>◀︎</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {t.training.level}: {N_LEVEL} (固定) | {t.training.trial}: {currentTrial + 1}/{TOTAL_TRIALS}
        </Text>
      </View>
      
      <View style={styles.gridContainer}>
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }
            ]} 
          />
        </View>
        
        <View style={styles.grid}>
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {Array.from({ length: 3 }).map((_, colIndex) => {
                const cellIndex = rowIndex * 3 + colIndex;
                const isCenter = cellIndex === 4;
                return (
                  <View
                    key={cellIndex}
                    style={[
                      styles.gridCell,
                      isCenter && styles.hiddenCell,
                      highlightPosition === cellIndex && showingStimulus && styles.highlightedCell,
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.audioContainer}>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.visualButton, 
            !canRespond && styles.disabledButton,
            buttonsPressed.visual && styles.pressedButton
          ]} 
          onPress={handleVisualResponse}
          disabled={!canRespond || !isRunning}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>
            <Text style={styles.buttonIcon}>👁️</Text>
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.audioButton, 
            !canRespond && styles.disabledButton,
            buttonsPressed.audio && styles.pressedButton
          ]} 
          onPress={handleAudioResponse}
          disabled={!canRespond || !isRunning}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>
            <Text style={styles.buttonIcon}>👂</Text>
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  backArrowHeader: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  gridContainer: {
    alignItems: 'center',
    marginBottom: 30,
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  progressBarContainer: {
    width: 360,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  gridTitle: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 15,
  },
  grid: {
    width: 360,
    height: 360,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  gridCell: {
    width: 100,
    height: 100,
    backgroundColor: '#333',
    borderRadius: 12,
  },
  hiddenCell: {
    backgroundColor: 'transparent',
  },
  highlightedCell: {
    backgroundColor: '#FFD700', // Gold color for fixed mode
  },
  audioContainer: {
    alignItems: 'center',
    marginBottom: 30,
    height: 0,
    justifyContent: 'center',
  },
  audioTitle: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFF',
    minHeight: 80,
  },
  audioLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    gap: 20,
  },
  visualButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    flex: 1,
  },
  audioButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.3,
  },
  pressedButton: {
    backgroundColor: '#CCCCCC',
  },
  controlContainer: {
    alignItems: 'center',
    gap: 15,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 200,
  },
  stopButton: {
    backgroundColor: '#FF3333',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 200,
  },
  backButton: {
    backgroundColor: '#666',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    fontSize: 42,
  },
  buttonKanji: {
    fontSize: 28,
    fontWeight: '700',
  },
});