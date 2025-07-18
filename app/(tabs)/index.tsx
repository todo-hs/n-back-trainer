import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';

export default function HomeScreen() {
  const { settings } = useSettingsStore();
  const t = useTranslations(settings.language);
  
  const isDark = settings.theme === 'dark';
  
  const goToAdaptive = () => {
    router.navigate('/training/adaptive');
  };

  const goToFixed = () => {
    router.navigate('/training/fixed');
  };

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    title: {
      ...styles.title,
      color: isDark ? '#FFFFFF' : '#000000',
    },
    subtitle: {
      ...styles.subtitle,
      color: isDark ? '#888888' : '#666666',
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.content}>
        <Text style={dynamicStyles.title}>{t.home.title}</Text>
        <Text style={dynamicStyles.subtitle}>
          {t.home.subtitle}
        </Text>
        
        
        <TouchableOpacity style={styles.adaptiveButton} onPress={goToAdaptive}>
          <Text style={styles.buttonText}>{t.home.adaptiveTitle} (N={settings.adaptiveN})</Text>
          <Text style={styles.buttonSubtext}>{t.home.adaptiveSubtext}</Text>
          <Text style={styles.buttonDetail}>{t.home.adaptiveDetail}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.fixedButton} onPress={goToFixed}>
          <Text style={styles.buttonText}>{t.home.fixedTitle} (N={settings.fixedN})</Text>
          <Text style={styles.buttonSubtext}>{t.home.fixedSubtext}</Text>
          <Text style={styles.buttonDetail}>{t.home.fixedDetail} {settings.fixedN > 2 && !settings.isPremium && '🔓'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // This will be overridden by theme
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  adaptiveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  fixedButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 15,
    opacity: 0.95,
    textAlign: 'center',
    marginBottom: 3,
    fontWeight: '600',
  },
  buttonDetail: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});