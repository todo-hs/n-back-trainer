import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Alert, Modal, FlatList, View, Text } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const [showNLevelModal, setShowNLevelModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const t = useTranslations(settings.language);
  
  const isDark = settings.theme === 'dark';
  
  const nLevelOptions = [
    { value: 1, label: t.nLevels.n1, premium: false },
    { value: 2, label: t.nLevels.n2, premium: false },
    { value: 3, label: t.nLevels.n3, premium: false },
    { value: 4, label: t.nLevels.n4, premium: true },
    { value: 5, label: t.nLevels.n5, premium: true },
    { value: 6, label: t.nLevels.n6, premium: true },
    { value: 7, label: t.nLevels.n7, premium: true },
    { value: 8, label: t.nLevels.n8, premium: true },
    { value: 9, label: t.nLevels.n9, premium: true },
  ];
  
  const languageOptions = [
    { value: 'ja', label: t.general.japanese },
    { value: 'en', label: t.general.english },
  ];
  
  const handleNLevelSelect = (value: number, isPremium: boolean) => {
    if (isPremium && !settings.isPremium) {
      Alert.alert(
        t.settings.premiumFeature,
        settings.language === 'ja' 
          ? 'N=4以上の高難易度レベルはプレミアム会員限定です。\n\n月額300円でアンロックしますか？'
          : 'N=4+ high difficulty levels are for premium members only.\n\nUnlock for $3/month?',
        [
          { text: t.settings.cancel, style: 'cancel' },
          { text: t.settings.premiumUpgrade.replace('🚀 ', ''), onPress: () => handlePremiumUpgrade() }
        ]
      );
      return;
    }
    
    updateSettings({ fixedN: value });
    setShowNLevelModal(false);
  };
  
  const handleLanguageSelect = (language: 'ja' | 'en') => {
    updateSettings({ language });
    setShowLanguageModal(false);
  };
  
  const handlePremiumUpgrade = () => {
    // TODO: Implement RevenueCat subscription flow
    Alert.alert(
      t.settings.developmentMode,
      t.settings.freeTrialMessage,
      [
        { text: t.settings.ok, onPress: () => updateSettings({ isPremium: true }) }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with clean design */}
        <View style={[styles.headerContainer, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {t.settings.title}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#AAAAAA' : '#666666' }]}>
            Customize your training experience
          </Text>
        </View>
        
        {/* How to Play Section - First Priority */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
            {settings.language === 'ja' ? 'ヘルプ・情報' : 'Help & Info'}
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.settingCard,
              { 
                backgroundColor: isDark ? '#1C1C1C' : '#F9FAFB',
                borderColor: isDark ? '#404040' : '#E5E7EB',
                borderWidth: 1,
              }
            ]}
            onPress={() => setShowHowToPlayModal(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>📚</Text>
            </LinearGradient>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {settings.language === 'ja' ? 'N-Backの遊び方' : 'How to Play N-Back'}
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#9CA3AF' }]}>
                {settings.language === 'ja' ? 'ルール、スコア、効果について学ぶ' : 'Learn the rules, scoring, and benefits'}
              </Text>
            </View>
            
            <View style={[
              styles.valueChip,
              { 
                backgroundColor: isDark ? '#2A2A2A' : '#EEF2FF',
                borderWidth: 1,
                borderColor: isDark ? '#6366F1' : '#6366F1',
              }
            ]}>
              <Text style={[styles.valueText, { color: '#6366F1' }]}>
                {settings.language === 'ja' ? 'ガイド' : 'Guide'}
              </Text>
              <Text style={[styles.chevron, { color: '#6366F1' }]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Training Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
            {t.settings.trainingSettings}
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.settingCard,
              { 
                backgroundColor: isDark ? '#1C1C1C' : '#F9FAFB',
                borderColor: isDark ? '#404040' : '#E5E7EB',
                borderWidth: 1,
              }
            ]}
            onPress={() => setShowNLevelModal(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>🎯</Text>
            </LinearGradient>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {t.settings.fixedNLevel}
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#9CA3AF' }]}>
                {t.settings.fixedNDescription}
              </Text>
            </View>
            
            <View style={[
              styles.valueChip,
              { 
                backgroundColor: isDark ? '#2A2A2A' : '#EEF2FF',
                borderWidth: 2,
                borderColor: '#3B82F6',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }
            ]}>
              <Text style={[styles.valueText, { color: '#3B82F6' }]}>
                N={settings.fixedN}
              </Text>
              <Text style={[styles.chevron, { color: '#3B82F6' }]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
            {t.settings.audioFeedback}
          </Text>
          
          <View style={[
            styles.settingCard,
            { 
              backgroundColor: isDark ? '#111113' : '#F9FAFB',
              borderColor: isDark ? '#1F2937' : '#E5E7EB',
            }
          ]}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>📳</Text>
            </LinearGradient>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {t.settings.vibration}
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#9CA3AF' }]}>
                {t.settings.vibrationDescription}
              </Text>
            </View>
            
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
              trackColor={{ false: isDark ? '#404040' : '#E5E7EB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={isDark ? '#404040' : '#E5E7EB'}
            />
          </View>
        </View>
        
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
            {t.settings.appearance}
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.settingCard,
              { 
                backgroundColor: isDark ? '#1C1C1C' : '#F9FAFB',
                borderColor: isDark ? '#404040' : '#E5E7EB',
                borderWidth: 1,
              }
            ]}
            onPress={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={isDark ? ['#F59E0B', '#EF4444'] : ['#FCD34D', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>{settings.theme === 'dark' ? '🌙' : '☀️'}</Text>
            </LinearGradient>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {t.settings.theme}
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#9CA3AF' }]}>
                {t.settings.themeDescription}
              </Text>
            </View>
            
            <View style={[
              styles.valueChip,
              { 
                backgroundColor: isDark ? '#1F2937' : '#FEF3C7',
                borderWidth: 2,
                borderColor: '#F59E0B',
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }
            ]}>
              <Text style={[styles.valueText, { color: '#F59E0B' }]}>
                {settings.theme === 'dark' ? t.general.dark : t.general.light}
              </Text>
              <Text style={[styles.chevron, { color: '#F59E0B' }]}>›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.settingCard,
              { 
                backgroundColor: isDark ? '#1C1C1C' : '#F9FAFB',
                borderColor: isDark ? '#404040' : '#E5E7EB',
                borderWidth: 1,
              }
            ]}
            onPress={() => setShowLanguageModal(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#10B981', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.iconEmoji}>🌍</Text>
            </LinearGradient>
            
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {t.settings.language}
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#CCCCCC' : '#9CA3AF' }]}>
                {t.settings.languageDescription}
              </Text>
            </View>
            
            <View style={[
              styles.valueChip,
              { 
                backgroundColor: isDark ? '#1F2937' : '#D1FAE5',
                borderWidth: 2,
                borderColor: '#10B981',
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }
            ]}>
              <Text style={[styles.valueText, { color: '#10B981' }]}>
                {settings.language === 'ja' ? t.general.japanese : t.general.english}
              </Text>
              <Text style={[styles.chevron, { color: '#10B981' }]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        
        {/* Premium Upsell Card */}
        {!settings.isPremium && (
          <TouchableOpacity 
            style={styles.premiumCard}
            onPress={handlePremiumUpgrade}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B', '#EF4444', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumGradient}
            >
              <Text style={styles.premiumIcon}>⚡</Text>
              <Text style={styles.premiumTitle}>Unlock Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Access all N-levels and advanced features
              </Text>
              <View style={styles.premiumPriceContainer}>
                <Text style={styles.premiumPrice}>$3/month</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {/* N-Level Selection Modal */}
      <Modal
        visible={showNLevelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNLevelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { 
              backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
              borderColor: isDark ? '#404040' : '#E5E7EB',
            }
          ]}>
            <View style={[
              styles.modalHeader,
              { 
                backgroundColor: isDark ? '#111111' : '#F9FAFB',
                borderBottomColor: isDark ? '#404040' : '#E5E7EB',
              }
            ]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {t.settings.selectNLevel}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: isDark ? '#404040' : '#F3F4F6' }
                ]}
                onPress={() => setShowNLevelModal(false)}
              >
                <Text style={[styles.modalCloseText, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={nLevelOptions}
              keyExtractor={(item) => item.value.toString()}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB',
                      borderColor: isDark ? '#505050' : '#E5E7EB',
                    },
                    settings.fixedN === item.value && styles.modalOptionSelected,
                    item.premium && !settings.isPremium && styles.modalOptionLocked
                  ]}
                  onPress={() => handleNLevelSelect(item.value, item.premium)}
                >
                  <View style={styles.modalOptionContent}>
                    <Text style={[
                      styles.modalOptionText,
                      { color: isDark ? '#FFFFFF' : '#111827' },
                      settings.fixedN === item.value && styles.modalOptionTextSelected,
                      item.premium && !settings.isPremium && styles.modalOptionTextLocked
                    ]}>
                      {item.label}
                    </Text>
                    {item.premium && !settings.isPremium && (
                      <Text style={styles.lockIcon}>🔒</Text>
                    )}
                    {settings.fixedN === item.value && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            { 
              backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
              borderColor: isDark ? '#404040' : '#E5E7EB',
            }
          ]}>
            <View style={[
              styles.modalHeader,
              { 
                backgroundColor: isDark ? '#111111' : '#F9FAFB',
                borderBottomColor: isDark ? '#404040' : '#E5E7EB',
              }
            ]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {t.settings.language}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: isDark ? '#404040' : '#F3F4F6' }
                ]}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={[styles.modalCloseText, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languageOptions}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F9FAFB',
                      borderColor: isDark ? '#505050' : '#E5E7EB',
                    },
                    settings.language === item.value && styles.modalOptionSelected
                  ]}
                  onPress={() => handleLanguageSelect(item.value as 'ja' | 'en')}
                >
                  <View style={styles.modalOptionContent}>
                    <Text style={[
                      styles.modalOptionText,
                      { color: isDark ? '#FFFFFF' : '#111827' },
                      settings.language === item.value && styles.modalOptionTextSelected
                    ]}>
                      {item.label}
                    </Text>
                    {settings.language === item.value && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {/* How to Play Modal */}
      <Modal
        visible={showHowToPlayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHowToPlayModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
          <View style={[
            styles.tutorialModalContent,
            { 
              backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
              borderColor: isDark ? '#404040' : '#E5E7EB',
            }
          ]}>
            <View style={[
              styles.modalHeader,
              { 
                backgroundColor: isDark ? '#111111' : '#F9FAFB',
                borderBottomColor: isDark ? '#404040' : '#E5E7EB',
              }
            ]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {settings.language === 'ja' ? 'N-Backの遊び方' : 'How to Play N-Back'}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.modalCloseButton,
                  { backgroundColor: isDark ? '#404040' : '#F3F4F6' }
                ]}
                onPress={() => setShowHowToPlayModal(false)}
              >
                <Text style={[styles.modalCloseText, { color: isDark ? '#FFFFFF' : '#6B7280' }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.tutorialContent}
              showsVerticalScrollIndicator={false}
            >
              {/* What is N-Back */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '🧠 N-Backとは？' : '🧠 What is N-Back?'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja' 
                    ? 'N-Backは作業記憶（ワーキングメモリー）を鍛える科学的に証明されたトレーニングです。視覚と聴覚の刺激を記憶し、N個前の刺激と一致するかを判断します。'
                    : 'N-Back is a scientifically proven training method for working memory. You need to remember visual and auditory stimuli and determine if they match stimuli from N steps back.'}
                </Text>
              </View>
              
              {/* How to Play */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '🎮 遊び方' : '🎮 How to Play'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja'
                    ? '1. グリッド上の光る位置（視覚）と読み上げられる文字（聴覚）を記憶\n\n2. 現在の刺激がN個前の刺激と一致する場合、対応するボタンを押す\n\n3. 一致しない場合は何も押さない'
                    : '1. Remember the glowing position (visual) and spoken letter (audio)\n\n2. Press the corresponding button if current stimulus matches the one from N steps back\n\n3. Do nothing if they don\'t match'}
                </Text>
              </View>
              
              {/* Scoring System */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '📊 スコアシステム' : '📊 Scoring System'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja'
                    ? '✅ ヒット: 一致時に正しく押した\n❌ ミス: 一致時に押さなかった\n✅ 正しい拒否: 非一致時に正しく押さなかった\n❌ 誤報: 非一致時に間違って押した\n\n正答率 = (ヒット + 正しい拒否) ÷ 全試行数 × 100%'
                    : '✅ Hit: Correctly pressed when matching\n❌ Miss: Didn\'t press when matching\n✅ Correct Rejection: Correctly didn\'t press when not matching\n❌ False Alarm: Incorrectly pressed when not matching\n\nAccuracy = (Hits + Correct Rejections) ÷ Total Trials × 100%'}
                </Text>
              </View>
              
              {/* Training Modes */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '🎯 トレーニングモード' : '🎯 Training Modes'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja'
                    ? '🔵 適応型トレーニング\nパフォーマンスに基づいて自動的にレベルが調整されます。常に最適な難易度でトレーニングできます。\n\n🟢 固定型トレーニング\n設定したNレベルで一定の難易度を維持します。特定のレベルを集中的に練習したい場合に最適です。'
                    : '🔵 Adaptive Training\nAutomatically adjusts level based on your performance. Always trains at your optimal difficulty level.\n\n🟢 Fixed Training\nMaintains consistent difficulty at your selected N-level. Perfect for focused practice at a specific level.'}
                </Text>
              </View>
              
              {/* Level Rules */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '📈 レベル調整ルール' : '📈 Level Adjustment Rules'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja'
                    ? '🔥 レベルアップ: 正答率80%以上でN+1\n❄️ レベルダウン: 正答率50%未満でN-1\n\n適応モードでは自動調整されます。'
                    : '🔥 Level Up: 80%+ accuracy → N+1\n❄️ Level Down: <50% accuracy → N-1\n\nAdaptive mode adjusts automatically.'}
                </Text>
              </View>
              
              {/* Benefits */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '🌟 トレーニング効果' : '🌟 Training Benefits'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja'
                    ? '• 作業記憶の向上\n• 集中力と注意力の強化\n• 情報処理速度の向上\n• 認知的柔軟性の向上\n• 学習能力の向上\n\n継続的な練習で効果を実感できます！'
                    : '• Improved working memory\n• Enhanced focus and attention\n• Faster information processing\n• Better cognitive flexibility\n• Enhanced learning ability\n\nConsistent practice yields real results!'}
                </Text>
              </View>
              
              {/* Tips */}
              <View style={styles.tutorialSection}>
                <Text style={[styles.tutorialSectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {settings.language === 'ja' ? '💡 コツ' : '💡 Tips'}
                </Text>
                <Text style={[styles.tutorialText, { color: isDark ? '#CCCCCC' : '#6B7280' }]}>
                  {settings.language === 'ja'
                    ? '• 確信がある時だけボタンを押す\n• 迷った時は押さない方が安全\n• 集中力を維持する\n• 毎日短時間でも継続する'
                    : '• Only press when you\'re confident\n• When in doubt, don\'t press\n• Maintain focus throughout\n• Practice daily, even if briefly'}
                </Text>
              </View>
            </ScrollView>
            
            <View style={[
              styles.tutorialFooter,
              { backgroundColor: isDark ? '#111111' : '#F9FAFB' }
            ]}>
              <TouchableOpacity 
                style={[
                  styles.tutorialCloseButton,
                  { backgroundColor: '#6366F1' }
                ]}
                onPress={() => setShowHowToPlayModal(false)}
              >
                <Text style={styles.tutorialCloseButtonText}>
                  {settings.language === 'ja' ? '始めましょう！' : 'Let\'s Start!'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 24,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  valueChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '700',
  },
  
  // Premium Card
  premiumCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  premiumGradient: {
    padding: 28,
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  premiumPriceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  premiumPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalList: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalOption: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  modalOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  modalOptionLocked: {
    opacity: 0.5,
  },
  modalOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    letterSpacing: -0.2,
  },
  modalOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalOptionTextLocked: {
    color: '#9CA3AF',
  },
  lockIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  checkIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  
  // Tutorial Modal Styles
  tutorialModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 40,
    maxHeight: '90%',
    borderWidth: 1,
    overflow: 'hidden',
  },
  tutorialContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tutorialSection: {
    marginBottom: 24,
  },
  tutorialSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  tutorialText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  tutorialFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tutorialCloseButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  tutorialCloseButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});