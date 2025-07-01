import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Eye, Ear } from 'lucide-react-native';

interface ResponseButtonsProps {
  onVisualHit: () => void;
  onAudioHit: () => void;
  disabled?: boolean;
}

export function ResponseButtons({ onVisualHit, onAudioHit, disabled = false }: ResponseButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.visualButton, disabled && styles.disabled]}
        onPress={onVisualHit}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Eye size={32} color="#000000" />
        <Text style={styles.buttonText}>VISUAL</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.audioButton, disabled && styles.disabled]}
        onPress={onAudioHit}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Ear size={32} color="#000000" />
        <Text style={styles.buttonText}>AUDIO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: 140,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  visualButton: {
    backgroundColor: '#FFFFFF',
  },
  audioButton: {
    backgroundColor: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});