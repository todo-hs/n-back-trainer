import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionStats } from '../types';

interface StatsState {
  sessions: SessionStats[];
  addSession: (session: Omit<SessionStats, 'id'>) => void;
  getSessionsByTimeOfDay: (timeOfDay: SessionStats['timeOfDay']) => SessionStats[];
  getRecentSessions: (limit?: number) => SessionStats[];
  getBestNLevel: () => number;
  getAverageAccuracy: () => number;
  getTotalSessions: () => number;
  getPerformanceByTimeOfDay: () => Record<SessionStats['timeOfDay'], { sessions: number; avgAccuracy: number; avgNLevel: number }>;
  getNLevelProgression: () => { date: string; nLevel: number; mode: 'adaptive' | 'fixed' }[];
  getAccuracyTrend: (limit?: number) => { date: string; accuracy: number; nLevel: number; mode: 'adaptive' | 'fixed' }[];
  getPerformanceTrends: () => {
    weeklyAverage: number;
    monthlyAverage: number;
    improvementRate: number;
    consistencyScore: number;
  };
  clearStats: () => void;
}

// Helper function to determine time of day
const getTimeOfDay = (date: Date): SessionStats['timeOfDay'] => {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

// Helper function to generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      sessions: [],
      
      addSession: (sessionData) => {
        const newSession: SessionStats = {
          ...sessionData,
          id: generateId(),
          timeOfDay: getTimeOfDay(sessionData.startedAt),
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));
      },
      
      getSessionsByTimeOfDay: (timeOfDay) => {
        return get().sessions.filter(session => session.timeOfDay === timeOfDay);
      },
      
      getRecentSessions: (limit = 10) => {
        return get().sessions
          .sort((a, b) => {
            const dateA = new Date(a.startedAt);
            const dateB = new Date(b.startedAt);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, limit);
      },
      
      getBestNLevel: () => {
        const sessions = get().sessions;
        if (sessions.length === 0) return 0;
        return Math.max(...sessions.map(s => s.nLevel));
      },
      
      getAverageAccuracy: () => {
        const sessions = get().sessions;
        if (sessions.length === 0) return 0;
        const totalAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0);
        return Math.round(totalAccuracy / sessions.length);
      },
      
      getTotalSessions: () => {
        return get().sessions.length;
      },
      
      getPerformanceByTimeOfDay: () => {
        const sessions = get().sessions;
        const timeOfDayStats: Record<SessionStats['timeOfDay'], { sessions: number; avgAccuracy: number; avgNLevel: number }> = {
          morning: { sessions: 0, avgAccuracy: 0, avgNLevel: 0 },
          afternoon: { sessions: 0, avgAccuracy: 0, avgNLevel: 0 },
          evening: { sessions: 0, avgAccuracy: 0, avgNLevel: 0 },
          night: { sessions: 0, avgAccuracy: 0, avgNLevel: 0 },
        };
        
        // Group sessions by time of day
        const groupedSessions = sessions.reduce((groups, session) => {
          const timeOfDay = session.timeOfDay;
          if (!groups[timeOfDay]) {
            groups[timeOfDay] = [];
          }
          groups[timeOfDay].push(session);
          return groups;
        }, {} as Record<SessionStats['timeOfDay'], SessionStats[]>);
        
        // Calculate statistics for each time period
        Object.keys(timeOfDayStats).forEach((timeOfDay) => {
          const periodSessions = groupedSessions[timeOfDay as SessionStats['timeOfDay']] || [];
          if (periodSessions.length > 0) {
            const avgAccuracy = periodSessions.reduce((sum, s) => sum + s.accuracy, 0) / periodSessions.length;
            const avgNLevel = periodSessions.reduce((sum, s) => sum + s.nLevel, 0) / periodSessions.length;
            
            timeOfDayStats[timeOfDay as SessionStats['timeOfDay']] = {
              sessions: periodSessions.length,
              avgAccuracy: Math.round(avgAccuracy),
              avgNLevel: Math.round(avgNLevel * 10) / 10, // Round to 1 decimal place
            };
          }
        });
        
        return timeOfDayStats;
      },
      
      getNLevelProgression: () => {
        const sessions = get().sessions;
        return sessions
          .sort((a, b) => {
            const dateA = new Date(a.startedAt);
            const dateB = new Date(b.startedAt);
            return dateA.getTime() - dateB.getTime();
          })
          .map(session => ({
            date: new Date(session.startedAt).toISOString().split('T')[0], // YYYY-MM-DD format
            nLevel: session.nLevel,
            mode: session.mode,
          }));
      },
      
      getAccuracyTrend: (limit = 20) => {
        const sessions = get().sessions;
        return sessions
          .sort((a, b) => {
            const dateA = new Date(a.startedAt);
            const dateB = new Date(b.startedAt);
            return dateB.getTime() - dateA.getTime(); // Most recent first
          })
          .slice(0, limit)
          .reverse() // Chronological order for trend
          .map(session => ({
            date: new Date(session.startedAt).toISOString().split('T')[0],
            accuracy: session.accuracy,
            nLevel: session.nLevel,
            mode: session.mode,
          }));
      },
      
      getPerformanceTrends: () => {
        const sessions = get().sessions;
        if (sessions.length === 0) {
          return {
            weeklyAverage: 0,
            monthlyAverage: 0,
            improvementRate: 0,
            consistencyScore: 0,
          };
        }
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Weekly average
        const weekSessions = sessions.filter(s => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate >= oneWeekAgo;
        });
        const weeklyAverage = weekSessions.length > 0 
          ? Math.round(weekSessions.reduce((sum, s) => sum + s.accuracy, 0) / weekSessions.length)
          : 0;
        
        // Monthly average
        const monthSessions = sessions.filter(s => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate >= oneMonthAgo;
        });
        const monthlyAverage = monthSessions.length > 0 
          ? Math.round(monthSessions.reduce((sum, s) => sum + s.accuracy, 0) / monthSessions.length)
          : 0;
        
        // Improvement rate (compare first half vs second half of sessions)
        const sortedSessions = sessions.sort((a, b) => {
          const dateA = new Date(a.startedAt);
          const dateB = new Date(b.startedAt);
          return dateA.getTime() - dateB.getTime();
        });
        const midPoint = Math.floor(sortedSessions.length / 2);
        const firstHalf = sortedSessions.slice(0, midPoint);
        const secondHalf = sortedSessions.slice(midPoint);
        
        const firstHalfAvg = firstHalf.length > 0 
          ? firstHalf.reduce((sum, s) => sum + s.accuracy, 0) / firstHalf.length
          : 0;
        const secondHalfAvg = secondHalf.length > 0 
          ? secondHalf.reduce((sum, s) => sum + s.accuracy, 0) / secondHalf.length
          : 0;
        
        const improvementRate = firstHalfAvg > 0 
          ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
          : 0;
        
        // Consistency score (inverse of standard deviation)
        const allAccuracies = sessions.map(s => s.accuracy);
        const average = allAccuracies.reduce((sum, acc) => sum + acc, 0) / allAccuracies.length;
        const variance = allAccuracies.reduce((sum, acc) => sum + Math.pow(acc - average, 2), 0) / allAccuracies.length;
        const standardDeviation = Math.sqrt(variance);
        const consistencyScore = Math.max(0, Math.round(100 - standardDeviation));
        
        return {
          weeklyAverage,
          monthlyAverage,
          improvementRate,
          consistencyScore,
        };
      },
      
      clearStats: () => set({ sessions: [] }),
    }),
    {
      name: 'n-back-stats',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization to handle Date objects
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            sessions: state.state.sessions.map(session => ({
              ...session,
              startedAt: session.startedAt.toISOString(),
              finishedAt: session.finishedAt.toISOString(),
            })),
          },
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            sessions: parsed.state.sessions.map((session: any) => ({
              ...session,
              startedAt: new Date(session.startedAt),
              finishedAt: new Date(session.finishedAt),
            })),
          },
        };
      },
    }
  )
);