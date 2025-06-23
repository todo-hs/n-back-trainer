import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';

export default function HomeScreen() {
  const { settings } = useSettingsStore();
  const t = useTranslations(settings.language);
  
  const goToAdaptive = () => {
    router.navigate('/training/adaptive');
  };

  const goToFixed = () => {
    router.navigate('/training/fixed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.home.title}</Text>
        <Text style={styles.subtitle}>
          {t.home.subtitle}
        </Text>
        
        <View style={styles.modeExplanation}>
          <Text style={styles.explanationTitle}>{t.home.rulesTitle}</Text>
          <Text style={styles.explanationText}>
            {t.home.rulesText}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.adaptiveButton} onPress={goToAdaptive}>
          <Text style={styles.buttonText}>{t.home.adaptiveTitle}</Text>
          <Text style={styles.buttonSubtext}>{t.home.adaptiveSubtext}</Text>
          <Text style={styles.buttonDetail}>{t.home.adaptiveDetail}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.fixedButton} onPress={goToFixed}>
          <Text style={styles.buttonText}>{t.home.fixedTitle} (N={settings.fixedN})</Text>
          <Text style={styles.buttonSubtext}>{settings.fixedN}{t.home.fixedSubtext}</Text>
          <Text style={styles.buttonDetail}>{t.home.fixedDetail} {settings.fixedN > 2 && !settings.isPremium && '🔓'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 30,
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
  modeExplanation: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: '90%',
    alignItems: 'center',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
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
    marginBottom: 5,
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
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 3,
  },
  buttonDetail: {
    color: '#FFFFFF',
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});