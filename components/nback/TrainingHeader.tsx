import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';

interface TrainingHeaderProps {
  nLevel: number;
  currentTrial: number;
  totalTrials: number;
}

export function TrainingHeader({ nLevel, currentTrial, totalTrials }: TrainingHeaderProps) {
  const progress = currentTrial / totalTrials;
  
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={styles.levelContainer}>
          <Text style={styles.label}>N-LEVEL</Text>
          <Text style={styles.value}>{nLevel}</Text>
        </View>
        <View style={styles.trialContainer}>
          <Text style={styles.label}>TRIAL</Text>
          <Text style={styles.value}>{currentTrial}/{totalTrials}</Text>
        </View>
      </View>
      <ProgressBar progress={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelContainer: {
    alignItems: 'flex-start',
  },
  trialContainer: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '700',
  },
});