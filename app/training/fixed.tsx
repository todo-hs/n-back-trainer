import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Alert, Animated, Vibration } from 'react-native';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';

// Types
interface Trial {
  position: number;
  letter: string;
}

export default function FixedTrainingScreen() {
  const { settings } = useSettingsStore();
  const t = useTranslations(settings.language);
  const N_LEVEL = settings.fixedN; // Use selected fixed N-level from settings
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(null);
  const [currentLetter, setCurrentLetter] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showingStimulus, setShowingStimulus] = useState(false);
  
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
  const STIMULUS_DURATION = 500; // 500ms to show stimulus
  const INTER_STIMULUS_INTERVAL = 2500; // Total time per trial
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
            position: Math.floor(Math.random() * 9),
            letter: nBackTrial.letter
          });
        }
        plannedMatches++;
      } else {
        // Random trial (avoid accidental matches)
        let position, letter;
        let attempts = 0;
        do {
          position = Math.floor(Math.random() * 9);
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

  // Start the game
  const handleStartTraining = () => {
    const newTrials = generateTrials(N_LEVEL, TOTAL_TRIALS);
    setTrials(newTrials);
    setCurrentTrial(0);
    setIsRunning(true);
    setScore({ correct: 0, total: 0 });
    setVisualHits([]);
    setAudioHits([]);
    
    // Reset animations
    progressAnimation.setValue(0);
    responseAnimation.setValue(0);
    
    // Haptic feedback for game start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

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
      rate: 0.8,
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
  }, [isRunning, currentTrial, trials]);

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
    
    // Enhanced feedback
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateResponse(true);
      
      // Play success sound via speech
      setTimeout(() => {
        Speech.speak('Good', { language: 'en-US', pitch: 1.2, rate: 1.5 });
      }, 100);
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
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
    
    // Enhanced feedback
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateResponse(true);
      
      // Play success sound via speech
      setTimeout(() => {
        Speech.speak('Good', { language: 'en-US', pitch: 1.2, rate: 1.5 });
      }, 100);
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      animateResponse(false);
      
      // Vibration pattern for error
      Vibration.vibrate([100, 50, 100]);
    }
  };

  // End game
  const endGame = () => {
    setIsRunning(false);
    const accuracy = score.total > 0 ? (score.correct / score.total * 100).toFixed(1) : '0';
    
    Alert.alert(
      t.training.sessionComplete,
      `${t.training.accuracy}: ${accuracy}%\n${t.training.correct}: ${score.correct}/${score.total}\n${t.training.level}: ${N_LEVEL} (${settings.language === 'ja' ? '固定' : 'Fixed'})`,
      [
        { text: t.training.continue, onPress: () => handleStartTraining() },
        { text: t.training.backToHome, onPress: () => router.push('/') }
      ]
    );
  };

  const handleBackToHome = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    setIsRunning(false);
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.training.fixed}</Text>
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
                return (
                  <View
                    key={cellIndex}
                    style={[
                      styles.gridCell,
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
        <Text style={styles.audioTitle}>
          {showingStimulus ? currentLetter : ' '}
        </Text>
        <Text style={styles.audioLabel}>
          {canRespond ? t.training.detectMessage : `${N_LEVEL}${t.training.waitMessage}`}
        </Text>
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
        >
          <Text style={styles.buttonText}>{t.training.positionButton}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.audioButton, 
            !canRespond && styles.disabledButton,
            buttonsPressed.audio && styles.pressedButton
          ]} 
          onPress={handleAudioResponse}
          disabled={!canRespond || !isRunning}
        >
          <Text style={styles.buttonText}>{t.training.letterButton}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartTraining}>
            <Text style={styles.buttonText}>{t.training.startButton}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={endGame}>
            <Text style={styles.buttonText}>{t.training.stopButton}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Text style={styles.buttonText}>{t.training.backButton}</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
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
  highlightedCell: {
    backgroundColor: '#FFD700', // Gold color for fixed mode
  },
  audioContainer: {
    alignItems: 'center',
    marginBottom: 30,
    height: 100,
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
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    flex: 1,
  },
  audioButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 12,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.3,
  },
  pressedButton: {
    backgroundColor: '#FFFFFF',
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
});