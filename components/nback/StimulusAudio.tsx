import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../../store/settingsStore';

interface StimulusAudioProps {
  letter: string;
  play: boolean;
  visible?: boolean;
}

export function StimulusAudio({ letter, play, visible = true }: StimulusAudioProps) {
  const { settings } = useSettingsStore();
  
  useEffect(() => {
    if (play && settings.soundEnabled) {
      Speech.speak(letter, {
        language: 'en-US',
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,
      });
    }
  }, [play, letter, settings.soundEnabled]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{letter}</Text>
      <Text style={styles.label}>AUDIO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  letter: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
});