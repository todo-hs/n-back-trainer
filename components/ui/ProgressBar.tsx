import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export function ProgressBar({ 
  progress, 
  height = 4, 
  backgroundColor = '#333', 
  progressColor = '#007AFF' 
}: ProgressBarProps) {
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: progressColor 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
});