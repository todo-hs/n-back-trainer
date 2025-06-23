import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Your Training Progress</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Sessions</Text>
          <Text style={styles.cardContent}>
            Statistics and progress tracking will be implemented here.
            Features will include:
            {'\n\n'}• Session history
            {'\n'}• N-level progression
            {'\n'}• Accuracy trends
            {'\n'}• Reaction time analysis
            {'\n'}• Performance graphs
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Metrics</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Best N-Level</Text>
            <Text style={styles.metricValue}>-</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Total Sessions</Text>
            <Text style={styles.metricValue}>-</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Accuracy</Text>
            <Text style={styles.metricValue}>-</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
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
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});