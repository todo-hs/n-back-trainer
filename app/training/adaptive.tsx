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

export default function AdaptiveTrainingScreen() {
  const { settings, updateAdaptiveLevel, checkDailyLevelDecrease } = useSettingsStore();
  const { addSession } = useStatsStore();
  const t = useTranslations(settings.language);
  
  // Game state - use persistent adaptive level
  const [nLevel, setNLevel] = useState(settings.adaptiveN || 2);
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
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  
  // Level up celebration effect
  const [showLevelUpEffect, setShowLevelUpEffect] = useState(false);
  const levelUpScale = useRef(new Animated.Value(0)).current;
  const levelUpOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnimations = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;
  
  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants
  const STIMULUS_DURATION = 800; // 800ms to show stimulus
  const FADE_OUT_DURATION = 1000; // 1000ms fade out animation
  const INTER_STIMULUS_INTERVAL = 3000; // Total time per trial (3 seconds)
  const TOTAL_TRIALS = 20;
  // Optimal letter count based on N-level for effective training
  const getOptimalLetters = (nLevel: number) => {
    const optimalCount = Math.max(3, Math.min(8, nLevel + 2)); // N+2 letters, min 3, max 8
    return 'ABCDEFGH'.slice(0, optimalCount).split('');
  };
  
  const LETTERS = getOptimalLetters(nLevel);

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
  
  // Level up celebration effect
  const triggerLevelUpEffect = () => {
    setShowLevelUpEffect(true);
    
    // Level up text animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(levelUpScale, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(levelUpOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(levelUpOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLevelUpEffect(false);
      levelUpScale.setValue(0);
    });
    
    // Confetti animation
    const confettiAnimationList = confettiAnimations.map((confetti, index) => {
      const delay = index * 50;
      const randomX = (Math.random() - 0.5) * 400;
      const randomRotation = Math.random() * 720;
      
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(confetti.translateY, {
            toValue: 800,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.translateX, {
            toValue: randomX,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(confetti.rotate, {
            toValue: randomRotation,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(1500),
            Animated.timing(confetti.opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });
    
    Animated.parallel(confettiAnimationList).start(() => {
      // Reset confetti positions
      confettiAnimations.forEach(confetti => {
        confetti.translateY.setValue(-100);
        confetti.translateX.setValue(0);
        confetti.rotate.setValue(0);
        confetti.opacity.setValue(1);
      });
    });
    
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };


  // Initialize game when screen comes into focus (including first load and returning from back button)
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, initializing game...');
      
      // Check for daily level decrease on app focus
      checkDailyLevelDecrease();
      
      // Update nLevel from persistent settings
      setNLevel(settings.adaptiveN || 2);
      
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
      highlightOpacity.setValue(0);

      // Start a new game after delay
      const startDelay = setTimeout(() => {
        console.log('Starting new game...');
        
        // Stop any ongoing speech first
        Speech.stop();
        
        // Generate new trials with current adaptive level
        const currentLevel = settings.adaptiveN || 2;
        setNLevel(currentLevel);
        const newTrials = generateTrials(currentLevel, TOTAL_TRIALS);
        
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
        
        // Reset highlight opacity before starting
        highlightOpacity.setValue(0);
        
        setIsRunning(true); // Start the game
        
        console.log('Game started with', newTrials.length, 'trials');
        
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 3000);

      return () => {
        console.log('Cleaning up focus effect...');
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
    setCanRespond(currentTrial >= nLevel); // Can only respond after N trials
    
    // Animate cell highlight with fade in
    Animated.timing(highlightOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    // Update progress animation
    const progress = (currentTrial + 1) / trials.length;
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    // Haptic feedback for stimulus
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Stop any ongoing speech and speak the letter
    Speech.stop();
    setTimeout(() => {
      Speech.speak(trial.letter.toLowerCase(), {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8, // Improved speech rate
        quality: 'enhanced',
      });
    }, 100); // Small delay to ensure previous speech is stopped
    
    // Start fade out after stimulus duration
    const fadeOutTimeout = setTimeout(() => {
      Animated.timing(highlightOpacity, {
        toValue: 0,
        duration: FADE_OUT_DURATION,
        useNativeDriver: false,
      }).start(() => {
        setShowingStimulus(false);
        setHighlightPosition(null);
      });
    }, STIMULUS_DURATION);
    
    // Move to next trial
    intervalRef.current = setTimeout(() => {
      setCurrentTrial(currentTrial + 1);
      // Reset button states for next trial
      setButtonsPressed({visual: false, audio: false});
    }, INTER_STIMULUS_INTERVAL);
    
    return () => {
      clearTimeout(fadeOutTimeout);
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isRunning, currentTrial, trials.length]);

  // Handle responses
  const handleVisualResponse = () => {
    if (!canRespond || !isRunning || currentTrial >= trials.length) return;
    
    // Visual feedback for button press
    setButtonsPressed(prev => ({...prev, visual: true}));
    
    const currentTrialData = trials[currentTrial];
    const nBackTrial = trials[currentTrial - nLevel];
    const isCorrect = currentTrialData.position === nBackTrial.position;
    
    const newVisualHits = [...visualHits];
    newVisualHits[currentTrial] = true;
    setVisualHits(newVisualHits);
    
    // Enhanced feedback (no score tracking here anymore)
    if (isCorrect) {
      if (settings.vibration) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      animateResponse(true);
    } else {
      if (settings.vibration) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      animateResponse(false);
    }
  };

  const handleAudioResponse = () => {
    if (!canRespond || !isRunning || currentTrial >= trials.length) return;
    
    // Visual feedback for button press
    setButtonsPressed(prev => ({...prev, audio: true}));
    
    const currentTrialData = trials[currentTrial];
    const nBackTrial = trials[currentTrial - nLevel];
    const isCorrect = currentTrialData.letter === nBackTrial.letter;
    
    const newAudioHits = [...audioHits];
    newAudioHits[currentTrial] = true;
    setAudioHits(newAudioHits);
    
    // Enhanced feedback (no score tracking here anymore)
    if (isCorrect) {
      if (settings.vibration) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      animateResponse(true);
    } else {
      if (settings.vibration) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      animateResponse(false);
    }
  };

  // End game
  const endGame = () => {
    setIsRunning(false);
    const endTime = new Date();
    
    // Calculate proper N-Back scores
    const validTrials = trials.length - nLevel;
    let visualHitsCount = 0;
    let visualMissesCount = 0;
    let visualCorrectRejectionsCount = 0;
    let visualFalseAlarmsCount = 0;
    let audioHitsCount = 0;
    let audioMissesCount = 0;
    let audioCorrectRejectionsCount = 0;
    let audioFalseAlarmsCount = 0;
    
    // Calculate for each trial after nLevel
    for (let i = nLevel; i < trials.length; i++) {
      const currentTrialData = trials[i];
      const nBackTrial = trials[i - nLevel];
      
      // Visual modality
      const visualMatch = currentTrialData.position === nBackTrial.position;
      const visualPressed = visualHits[i] || false;
      
      if (visualMatch && visualPressed) {
        visualHitsCount++;
      } else if (visualMatch && !visualPressed) {
        visualMissesCount++;
      } else if (!visualMatch && !visualPressed) {
        visualCorrectRejectionsCount++;
      } else if (!visualMatch && visualPressed) {
        visualFalseAlarmsCount++;
      }
      
      // Audio modality
      const audioMatch = currentTrialData.letter === nBackTrial.letter;
      const audioPressed = audioHits[i] || false;
      
      if (audioMatch && audioPressed) {
        audioHitsCount++;
      } else if (audioMatch && !audioPressed) {
        audioMissesCount++;
      } else if (!audioMatch && !audioPressed) {
        audioCorrectRejectionsCount++;
      } else if (!audioMatch && audioPressed) {
        audioFalseAlarmsCount++;
      }
    }
    
    // Calculate accuracy for each modality with penalty system
    // N-Back Standard: (Hits + Correct Rejections - Misses - False Alarms) / Total Trials
    const visualScore = visualHitsCount + visualCorrectRejectionsCount - visualMissesCount - visualFalseAlarmsCount;
    const audioScore = audioHitsCount + audioCorrectRejectionsCount - audioMissesCount - audioFalseAlarmsCount;
    const visualAccuracy = validTrials > 0 ? Math.max(0, (visualScore / validTrials) * 100) : 0;
    const audioAccuracy = validTrials > 0 ? Math.max(0, (audioScore / validTrials) * 100) : 0;
    
    // Calculate hit rate and false alarm rate for detailed feedback
    const visualMatchCount = visualHitsCount + visualMissesCount;
    const visualNonMatchCount = visualCorrectRejectionsCount + visualFalseAlarmsCount;
    const visualHitRate = visualMatchCount > 0 ? (visualHitsCount / visualMatchCount) * 100 : 0;
    const visualFalseAlarmRate = visualNonMatchCount > 0 ? (visualFalseAlarmsCount / visualNonMatchCount) * 100 : 0;
    
    const audioMatchCount = audioHitsCount + audioMissesCount;
    const audioNonMatchCount = audioCorrectRejectionsCount + audioFalseAlarmsCount;
    const audioHitRate = audioMatchCount > 0 ? (audioHitsCount / audioMatchCount) * 100 : 0;
    const audioFalseAlarmRate = audioNonMatchCount > 0 ? (audioFalseAlarmsCount / audioNonMatchCount) * 100 : 0;
    
    // Overall accuracy with penalty system
    const totalScore = visualScore + audioScore;
    const totalTrials = validTrials * 2; // Visual + Audio trials
    const overallAccuracy = totalTrials > 0 ? Math.max(0, (totalScore / totalTrials) * 100) : 0;
    
    // Save session data
    if (sessionStartTime && validTrials > 0) {
      const duration = Math.round((endTime.getTime() - sessionStartTime.getTime()) / 1000);
      
      addSession({
        nLevel,
        mode: 'adaptive',
        visualHits: visualHitsCount,
        visualMisses: visualMissesCount,
        visualFalseAlarms: visualFalseAlarmsCount,
        audioHits: audioHitsCount,
        audioMisses: audioMissesCount,
        audioFalseAlarms: audioFalseAlarmsCount,
        averageReactionTime: 0,
        accuracy: Math.round(overallAccuracy),
        duration,
        startedAt: sessionStartTime,
        finishedAt: endTime,
      });
    }
    
    // Create detailed result message
    const resultMessage = 
      `${t.training.accuracy}: ${overallAccuracy.toFixed(1)}%\n\n` +
      `👁 Visual: ${visualAccuracy.toFixed(1)}% (${visualScore}/${validTrials})\n` +
      `Hit: ${visualHitRate.toFixed(0)}% | FA: ${visualFalseAlarmRate.toFixed(0)}%\n\n` +
      `👂 Audio: ${audioAccuracy.toFixed(1)}% (${audioScore}/${validTrials})\n` +
      `Hit: ${audioHitRate.toFixed(0)}% | FA: ${audioFalseAlarmRate.toFixed(0)}%\n\n` +
      `${t.training.level}: ${nLevel}`;
    
    Alert.alert(
      t.training.sessionComplete,
      resultMessage,
      [
        { text: t.training.continue, onPress: () => {
          // Restart game
          const newTrials = generateTrials(nLevel, TOTAL_TRIALS);
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
    
    // Adaptive logic: adjust N-level based on performance and persist
    if (validTrials >= 8) {
      if (overallAccuracy >= 80 && nLevel < 9) {
        const newLevel = nLevel + 1;
        setNLevel(newLevel);
        updateAdaptiveLevel(newLevel); // Persist the level up
        
        // Trigger celebration effect instead of alert
        setTimeout(() => {
          triggerLevelUpEffect();
          setTimeout(() => {
            Alert.alert(t.training.levelUp, `${t.training.level}: ${newLevel}`);
          }, 2500);
        }, 500);
      } else if (overallAccuracy < 50 && nLevel > 1) {
        const newLevel = nLevel - 1;
        setNLevel(newLevel);
        updateAdaptiveLevel(newLevel); // Persist the level down
        Alert.alert(t.training.levelDown, `${t.training.level}: ${newLevel}`);
      }
    }
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
          {t.training.level}: {nLevel} | {t.training.trial}: {currentTrial + 1}/{TOTAL_TRIALS}
        </Text>
      </View>
      
      <View style={styles.mainContent}>
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
                    <Animated.View
                      key={cellIndex}
                      style={[
                        styles.gridCell,
                        isCenter && styles.hiddenCell,
                        highlightPosition === cellIndex && {
                          backgroundColor: highlightOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#333', '#00FF00'],
                          }),
                          shadowOpacity: highlightOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.8],
                          }),
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
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
      </View>
      
      {/* Level Up Celebration Effect */}
      {showLevelUpEffect && (
        <View style={styles.celebrationOverlay}>
          {/* Confetti */}
          {confettiAnimations.map((confetti, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index % 5],
                  transform: [
                    { translateX: confetti.translateX },
                    { translateY: confetti.translateY },
                    { rotate: confetti.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }) },
                  ],
                  opacity: confetti.opacity,
                },
              ]}
            />
          ))}
          
          {/* Level Up Text */}
          <Animated.View
            style={[
              styles.levelUpContainer,
              {
                transform: [{ scale: levelUpScale }],
                opacity: levelUpOpacity,
              },
            ]}
          >
            <Text style={styles.levelUpText}>🎉 LEVEL UP! 🎉</Text>
            <Text style={styles.levelUpSubtext}>N-Level {nLevel}</Text>
          </Animated.View>
        </View>
      )}

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
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    backgroundColor: '#007AFF',
    borderRadius: 2,
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
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  audioContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    paddingBottom: 30,
  },
  visualButton: {
    flex: 1,
    height: 80,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioButton: {
    flex: 1,
    height: 80,
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.3,
  },
  pressedButton: {
    backgroundColor: '#808080',
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
  // Level up celebration styles
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  levelUpContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  levelUpText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  levelUpSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});