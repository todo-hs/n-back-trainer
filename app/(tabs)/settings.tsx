import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from '@/utils/i18n';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();
  const [showNLevelModal, setShowNLevelModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const t = useTranslations(settings.language);
  
  const isDark = settings.theme === 'dark';
  
  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: isDark ? '#000' : '#FFFFFF',
    },
    header: {
      ...styles.header,
      backgroundColor: '#007AFF', // Keep header blue regardless of theme
    },
    section: {
      ...styles.section,
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: '#007AFF', // Keep blue regardless of theme
    },
    settingRow: {
      ...styles.settingRow,
      backgroundColor: isDark ? '#1A1A1A' : '#F2F2F7',
      borderColor: isDark ? '#2A2A2A' : '#E5E5EA',
    },
    settingLabel: {
      ...styles.settingLabel,
      color: isDark ? '#FFF' : '#000',
    },
    settingDescription: {
      ...styles.settingDescription,
      color: isDark ? '#888' : '#666',
    },
    modalOverlay: {
      ...styles.modalOverlay,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      ...styles.modalContent,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderColor: isDark ? '#2A2A2A' : '#E5E5EA',
    },
    modalHeader: {
      ...styles.modalHeader,
      backgroundColor: isDark ? '#2A2A2A' : '#F2F2F7',
      borderBottomColor: isDark ? '#2A2A2A' : '#E5E5EA',
    },
    modalTitle: {
      ...styles.modalTitle,
      color: isDark ? '#FFF' : '#000',
    },
    nLevelOption: {
      ...styles.nLevelOption,
      backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9',
    },
    nLevelOptionText: {
      ...styles.nLevelOptionText,
      color: isDark ? '#FFF' : '#000',
    },
  };
  
  const nLevelOptions = [
    { value: 1, label: t.nLevels.n1, premium: false },
    { value: 2, label: t.nLevels.n2, premium: false },
    { value: 3, label: t.nLevels.n3, premium: true },
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
          ? 'N=3以上の高難易度レベルはプレミアム会員限定です。\n\n月額300円でアンロックしますか？'
          : 'N=3+ high difficulty levels are for premium members only.\n\nUnlock for $3/month?',
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
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={dynamicStyles.header}>
          <Text style={styles.title}>{t.settings.title}</Text>
          <Text style={styles.subtitle}>{t.settings.subtitle}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.trainingSettings}</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setShowNLevelModal(true)}
          >
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>⚙️</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.fixedNLevel}</Text>
                <Text style={styles.settingDescription}>{t.settings.fixedNDescription}</Text>
                {!settings.isPremium && settings.fixedN > 2 && (
                  <Text style={styles.premiumBadge}>{t.settings.premiumTrial}</Text>
                )}
              </View>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>N={settings.fixedN}</Text>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>🎯</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.adaptiveNLevel}</Text>
                <Text style={styles.settingDescription}>{t.settings.adaptiveNDescription}</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>{settings.initialN}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>🔢</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Trial Count</Text>
                <Text style={styles.settingDescription}>Number of trials per session</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>{settings.trialCount}</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>⏱️</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Stimulus Duration</Text>
                <Text style={styles.settingDescription}>How long each stimulus is shown</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>{settings.stimulusDuration}ms</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.audioFeedback}</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>🔊</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.soundEnabled}</Text>
                <Text style={styles.settingDescription}>{t.settings.soundDescription}</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
              trackColor={{ false: '#2A2A2A', true: '#007AFF' }}
              thumbColor={settings.soundEnabled ? '#FFF' : '#888'}
              ios_backgroundColor={'#2A2A2A'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>📳</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.vibration}</Text>
                <Text style={styles.settingDescription}>{t.settings.vibrationDescription}</Text>
              </View>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
              trackColor={{ false: '#2A2A2A', true: '#007AFF' }}
              thumbColor={settings.vibrationEnabled ? '#FFF' : '#888'}
              ios_backgroundColor={'#2A2A2A'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>🔤</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.showLetters}</Text>
                <Text style={styles.settingDescription}>{t.settings.showLettersDescription}</Text>
              </View>
            </View>
            <Switch
              value={settings.showLetters}
              onValueChange={(value) => updateSettings({ showLetters: value })}
              trackColor={{ false: '#2A2A2A', true: '#007AFF' }}
              thumbColor={settings.showLetters ? '#FFF' : '#888'}
              ios_backgroundColor={'#2A2A2A'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings.appearance}</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          >
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>{settings.theme === 'dark' ? '🌙' : '☀️'}</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.theme}</Text>
                <Text style={styles.settingDescription}>{t.settings.themeDescription}</Text>
              </View>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{settings.theme === 'dark' ? t.general.dark : t.general.light}</Text>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingRowContent}>
              <Text style={styles.settingIcon}>🌍</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>{t.settings.language}</Text>
                <Text style={styles.settingDescription}>{t.settings.languageDescription}</Text>
              </View>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{settings.language === 'ja' ? t.general.japanese : t.general.english}</Text>
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* N-Level Selection Modal */}
      <Modal
        visible={showNLevelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNLevelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.settings.selectNLevel}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowNLevelModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={nLevelOptions}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.nLevelOption,
                    settings.fixedN === item.value && styles.nLevelOptionSelected,
                    item.premium && !settings.isPremium && styles.nLevelOptionLocked
                  ]}
                  onPress={() => handleNLevelSelect(item.value, item.premium)}
                >
                  <View style={styles.nLevelOptionContent}>
                    <Text style={[
                      styles.nLevelOptionText,
                      settings.fixedN === item.value && styles.nLevelOptionTextSelected,
                      item.premium && !settings.isPremium && styles.nLevelOptionTextLocked
                    ]}>
                      {item.label}
                    </Text>
                    {item.premium && !settings.isPremium && (
                      <Text style={styles.premiumIcon}>🔒</Text>
                    )}
                    {settings.fixedN === item.value && (
                      <Text style={styles.selectedIcon}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
            
            {!settings.isPremium && (
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={handlePremiumUpgrade}
              >
                <Text style={styles.premiumButtonText}>
                  {t.settings.premiumUpgrade}
                </Text>
                <Text style={styles.premiumButtonSubtext}>
                  {t.settings.premiumPrice}
                </Text>
              </TouchableOpacity>
            )}
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.settings.language}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languageOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.nLevelOption,
                    settings.language === item.value && styles.nLevelOptionSelected,
                  ]}
                  onPress={() => handleLanguageSelect(item.value as 'ja' | 'en')}
                >
                  <View style={styles.nLevelOptionContent}>
                    <Text style={[
                      styles.nLevelOptionText,
                      settings.language === item.value && styles.nLevelOptionTextSelected,
                    ]}>
                      {item.label}
                    </Text>
                    {settings.language === item.value && (
                      <Text style={styles.selectedIcon}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 0,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#007AFF',
    marginBottom: 16,
    marginTop: 32,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 2,
    minHeight: 64,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  settingValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  settingArrow: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  premiumBadge: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '700',
    marginTop: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 0,
    width: '92%',
    maxHeight: '85%',
    borderWidth: 2,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  nLevelOption: {
    padding: 20,
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
  },
  nLevelOptionSelected: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nLevelOptionLocked: {
    opacity: 0.5,
  },
  nLevelOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nLevelOptionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
  },
  nLevelOptionTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  nLevelOptionTextLocked: {
    color: '#888',
  },
  premiumIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  selectedIcon: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  premiumButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginBottom: 6,
  },
  premiumButtonSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});