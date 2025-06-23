import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GridProps {
  highlightIndex?: number;
  size?: number;
  highlightColor?: string;
}

export function Grid({ highlightIndex, size = 300, highlightColor = '#00FF00' }: GridProps) {
  const cellSize = (size - 20) / 3; // Account for gaps
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.cell,
            {
              width: cellSize,
              height: cellSize,
              backgroundColor: highlightIndex === index ? highlightColor : '#1A1A1A',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 5,
  },
  cell: {
    borderRadius: 8,
    margin: 2.5,
  },
});