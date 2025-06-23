import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';

export default function StatsScreen() {
  try {
    const { settings } = useSettingsStore();
    const t = useTranslations(settings.language);
    
    const isDark = settings.theme === 'dark';
    
    const dynamicStyles = {
      container: {
        flex: 1,
        backgroundColor: isDark ? '#000' : '#FFFFFF',
      },
      title: {
        fontSize: 32,
        fontWeight: '700',
        color: isDark ? '#FFF' : '#000',
        textAlign: 'center',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 16,
        color: isDark ? '#666' : '#888',
        textAlign: 'center',
        marginTop: 8,
      },
      card: {
        backgroundColor: isDark ? '#1A1A1A' : '#F2F2F7',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: isDark ? '#2A2A2A' : '#E5E5EA',
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: isDark ? '#FFF' : '#000',
        marginBottom: 16,
      },
      text: {
        fontSize: 16,
        color: isDark ? '#FFF' : '#000',
        textAlign: 'center',
      },
    };

    return (
      <SafeAreaView style={dynamicStyles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={dynamicStyles.title}>📊 {t.stats.title}</Text>
            <Text style={dynamicStyles.subtitle}>{t.stats.subtitle}</Text>
          </View>
          
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>パフォーマンス概要</Text>
            <Text style={dynamicStyles.text}>統計機能は現在準備中です</Text>
            <Text style={dynamicStyles.text}>トレーニングを開始すると、ここに詳細な統計情報が表示されます</Text>
          </View>
          
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>今後追加予定の機能</Text>
            <Text style={dynamicStyles.text}>• N-レベル進行状況</Text>
            <Text style={dynamicStyles.text}>• 正解率推移</Text>
            <Text style={dynamicStyles.text}>• 時間帯別パフォーマンス</Text>
            <Text style={dynamicStyles.text}>• セッション履歴</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: 18, textAlign: 'center' }}>
          統計画面でエラーが発生しました
        </Text>
        <Text style={{ color: '#888', fontSize: 14, marginTop: 10, textAlign: 'center' }}>
          アプリを再起動してください
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
});