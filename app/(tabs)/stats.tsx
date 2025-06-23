import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useStatsStore } from '@/store/statsStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';
import { SessionStats } from '@/types';

// Helper function to format time of day in Japanese/English
const getTimeOfDayLabel = (timeOfDay: SessionStats['timeOfDay'], language: 'ja' | 'en'): string => {
  const labels = {
    ja: { morning: '朝', afternoon: '昼', evening: '夕方', night: '夜' },
    en: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', night: 'Night' }
  };
  return labels[language][timeOfDay];
};

// Helper function to format date
const formatDate = (date: Date, language: 'ja' | 'en'): string => {
  if (language === 'ja') {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export default function StatsScreen() {
  const { settings } = useSettingsStore();
  const { 
    getRecentSessions, 
    getBestNLevel, 
    getAverageAccuracy, 
    getTotalSessions,
    getPerformanceByTimeOfDay,
    getNLevelProgression,
    getAccuracyTrend,
    getPerformanceTrends
  } = useStatsStore();
  const t = useTranslations(settings.language);
  
  const isDark = settings.theme === 'dark';
  
  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: isDark ? '#000' : '#FFFFFF',
    },
    title: {
      ...styles.title,
      color: isDark ? '#FFF' : '#000',
    },
    subtitle: {
      ...styles.subtitle,
      color: isDark ? '#666' : '#888',
    },
    card: {
      ...styles.card,
      backgroundColor: isDark ? '#1A1A1A' : '#F2F2F7',
      borderColor: isDark ? '#2A2A2A' : '#E5E5EA',
    },
    cardTitle: {
      ...styles.cardTitle,
      color: isDark ? '#FFF' : '#000',
    },
    metricLabel: {
      ...styles.metricLabel,
      color: isDark ? '#888' : '#666',
    },
    sessionItem: {
      ...styles.sessionItem,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      borderColor: isDark ? '#333' : '#E5E5EA',
    },
    sessionTitle: {
      ...styles.sessionTitle,
      color: isDark ? '#FFF' : '#000',
    },
    sessionTime: {
      ...styles.sessionTime,
      color: isDark ? '#666' : '#888',
    },
    sessionStatLabel: {
      ...styles.sessionStatLabel,
      color: isDark ? '#888' : '#666',
    },
    noDataText: {
      ...styles.noDataText,
      color: isDark ? '#666' : '#888',
    },
    progressionContainer: {
      ...styles.progressionContainer,
      backgroundColor: isDark ? '#1A1A1A' : '#F2F2F7',
      borderColor: isDark ? '#2A2A2A' : '#E5E5EA',
    },
    progressionTitle: {
      ...styles.progressionTitle,
      color: isDark ? '#FFF' : '#000',
    },
    trendContainer: {
      ...styles.trendContainer,
      backgroundColor: isDark ? '#1A1A1A' : '#F2F2F7',
      borderColor: isDark ? '#2A2A2A' : '#E5E5EA',
    },
    trendTitle: {
      ...styles.trendTitle,
      color: isDark ? '#FFF' : '#000',
    },
    timeOfDayRow: {
      ...styles.timeOfDayRow,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
    },
    timeOfDayLabel: {
      ...styles.timeOfDayLabel,
      color: isDark ? '#FFF' : '#000',
    },
    timeOfDayStat: {
      ...styles.timeOfDayStat,
      color: isDark ? '#888' : '#666',
    },
  };
  
  const recentSessions = getRecentSessions(10);
  const bestNLevel = getBestNLevel();
  const averageAccuracy = getAverageAccuracy();
  const totalSessions = getTotalSessions();
  const timeOfDayPerformance = getPerformanceByTimeOfDay();
  const nLevelProgression = getNLevelProgression();
  const accuracyTrend = getAccuracyTrend(15);
  const performanceTrends = getPerformanceTrends();

  // Simple text-based visualization for N-Level progression
  const renderNLevelProgression = () => {
    if (nLevelProgression.length === 0) return null;
    
    const maxN = Math.max(...nLevelProgression.map(p => p.nLevel));
    const minN = Math.min(...nLevelProgression.map(p => p.nLevel));
    const range = maxN - minN || 1;
    
    return (
      <View style={styles.progressionContainer}>
        <Text style={styles.progressionTitle}>N-レベル進行状況 (最近15セッション)</Text>
        <View style={styles.progressionChart}>
          {nLevelProgression.slice(-15).map((point, index) => {
            const height = ((point.nLevel - minN) / range) * 40 + 20; // 20-60px height
            const isAdaptive = point.mode === 'adaptive';
            return (
              <View key={index} style={styles.progressionBar}>
                <View 
                  style={[
                    styles.progressionBarFill, 
                    { 
                      height, 
                      backgroundColor: isAdaptive ? '#007AFF' : '#34C759' 
                    }
                  ]} 
                />
                <Text style={styles.progressionBarLabel}>N{point.nLevel}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.progressionLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.legendText}>適応型</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#34C759' }]} />
            <Text style={styles.legendText}>固定型</Text>
          </View>
        </View>
      </View>
    );
  };

  // Simple text-based visualization for accuracy trend
  const renderAccuracyTrend = () => {
    if (accuracyTrend.length === 0) return null;
    
    return (
      <View style={styles.trendContainer}>
        <Text style={styles.trendTitle}>正解率推移 (最近15セッション)</Text>
        <View style={styles.trendChart}>
          {accuracyTrend.map((point, index) => {
            const height = (point.accuracy / 100) * 50 + 10; // 10-60px height
            const color = point.accuracy >= 80 ? '#34C759' : 
                         point.accuracy >= 60 ? '#FFD60A' : '#FF3B30';
            return (
              <View key={index} style={styles.trendBar}>
                <View 
                  style={[
                    styles.trendBarFill, 
                    { height, backgroundColor: color }
                  ]} 
                />
                <Text style={styles.trendBarLabel}>{point.accuracy}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderSessionItem = ({ item }: { item: SessionStats }) => (
    <View style={styles.sessionItem}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTitle}>
          {item.mode === 'adaptive' ? t.training.adaptive : t.training.fixed} - N{item.nLevel}
        </Text>
        <Text style={styles.sessionTime}>
          {formatDate(item.startedAt, settings.language)}
        </Text>
      </View>
      <View style={styles.sessionStats}>
        <View style={styles.sessionStatItem}>
          <Text style={styles.sessionStatLabel}>{t.training.accuracy}</Text>
          <Text style={styles.sessionStatValue}>{item.accuracy}%</Text>
        </View>
        <View style={styles.sessionStatItem}>
          <Text style={styles.sessionStatLabel}>⏱️</Text>
          <Text style={styles.sessionStatValue}>{Math.round(item.duration / 60)}m</Text>
        </View>
        <View style={styles.sessionStatItem}>
          <Text style={styles.sessionStatLabel}>
            {getTimeOfDayLabel(item.timeOfDay, settings.language)}
          </Text>
          <Text style={styles.sessionStatValue}>
            {item.timeOfDay === 'morning' ? '🌅' : 
             item.timeOfDay === 'afternoon' ? '☀️' : 
             item.timeOfDay === 'evening' ? '🌆' : '🌙'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={dynamicStyles.title}>📊 {t.stats.title}</Text>
          <Text style={dynamicStyles.subtitle}>{t.stats.subtitle}</Text>
        </View>
        
        {/* Performance Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.stats.performanceOverview}</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t.stats.bestNLevel}</Text>
            <Text style={styles.metricValue}>{bestNLevel > 0 ? `N=${bestNLevel}` : '-'}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t.stats.totalSessions}</Text>
            <Text style={styles.metricValue}>{totalSessions}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t.stats.averageAccuracy}</Text>
            <Text style={styles.metricValue}>{averageAccuracy > 0 ? `${averageAccuracy}%` : '-'}</Text>
          </View>
        </View>

        {/* Performance Trends */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 パフォーマンス分析</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>週平均正解率</Text>
            <Text style={styles.metricValue}>{performanceTrends.weeklyAverage > 0 ? `${performanceTrends.weeklyAverage}%` : '-'}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>月平均正解率</Text>
            <Text style={styles.metricValue}>{performanceTrends.monthlyAverage > 0 ? `${performanceTrends.monthlyAverage}%` : '-'}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>改善率</Text>
            <Text style={[
              styles.metricValue, 
              { color: performanceTrends.improvementRate >= 0 ? '#34C759' : '#FF3B30' }
            ]}>
              {performanceTrends.improvementRate > 0 ? '+' : ''}{performanceTrends.improvementRate}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>安定性スコア</Text>
            <Text style={styles.metricValue}>{performanceTrends.consistencyScore}/100</Text>
          </View>
        </View>

        {/* N-Level Progression */}
        {renderNLevelProgression()}

        {/* Accuracy Trend */}
        {renderAccuracyTrend()}

        {/* Time of Day Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ {t.stats.timeOfDayPerformance}</Text>
          {Object.entries(timeOfDayPerformance).map(([timeOfDay, stats]) => (
            <View key={timeOfDay} style={styles.timeOfDayRow}>
              <View style={styles.timeOfDayHeader}>
                <Text style={styles.timeOfDayLabel}>
                  {timeOfDay === 'morning' ? `🌅 ${t.stats.morning}` : 
                   timeOfDay === 'afternoon' ? `☀️ ${t.stats.afternoon}` : 
                   timeOfDay === 'evening' ? `🌆 ${t.stats.evening}` : `🌙 ${t.stats.night}`}
                </Text>
                <Text style={styles.timeOfDayCount}>{stats.sessions}{t.stats.sessions}</Text>
              </View>
              {stats.sessions > 0 && (
                <View style={styles.timeOfDayStats}>
                  <Text style={styles.timeOfDayStat}>{t.training.accuracy}: {stats.avgAccuracy}%</Text>
                  <Text style={styles.timeOfDayStat}>{settings.language === 'ja' ? '平均N' : 'Avg N'}: {stats.avgNLevel}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Recent Sessions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 {t.stats.recentSessions}</Text>
          {recentSessions.length > 0 ? (
            <FlatList
              data={recentSessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>
              {t.stats.noDataMessage}
            </Text>
          )}
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
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#007AFF',
  },
  
  // Time of Day Performance Styles
  timeOfDayRow: {
    marginBottom: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
  },
  timeOfDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeOfDayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  timeOfDayCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  timeOfDayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeOfDayStat: {
    fontSize: 13,
    color: '#888',
  },
  
  // Session Item Styles
  sessionItem: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
  },
  sessionTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sessionStatItem: {
    alignItems: 'center',
  },
  sessionStatLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  sessionStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  
  // No Data Styles
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  
  // Progression Chart Styles
  progressionContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  progressionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressionChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 16,
  },
  progressionBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  progressionBarFill: {
    width: '80%',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressionBarLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  progressionLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  
  // Trend Chart Styles
  trendContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 70,
  },
  trendBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  trendBarFill: {
    width: '80%',
    borderRadius: 2,
    marginBottom: 4,
  },
  trendBarLabel: {
    fontSize: 9,
    color: '#888',
    fontWeight: '600',
  },
});