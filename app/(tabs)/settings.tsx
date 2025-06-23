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
  
  // ダークモードでも背景のみ黒、他はライトモード仕様
  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: isDark ? '#000000' : '#F5F5F7',
    },
    header: {
      ...styles.header,
      backgroundColor: '#007AFF',
      borderBottomWidth: 0,
      borderBottomColor: 'transparent',
    },
    title: {
      ...styles.title,
      color: '#FFFFFF',
    },
    subtitle: {
      ...styles.subtitle,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    section: {
      ...styles.section,
    },
    sectionTitle: {
      ...styles.sectionTitle,
      color: '#1D4ED8',
    },
    settingRow: {
      ...styles.settingRow,
      backgroundColor: '#FFFFFF',
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    settingLabel: {
      ...styles.settingLabel,
      color: '#1C1C1E',
    },
    settingDescription: {
      ...styles.settingDescription,
      color: '#6B7280',
    },
    settingValue: {
      ...styles.settingValue,
      color: '#007AFF',
    },
    settingValueContainer: {
      ...styles.settingValueContainer,
      backgroundColor: 'rgba(0, 122, 255, 0.12)',
      borderColor: 'rgba(0, 122, 255, 0.2)',
    },
    settingValueDisplay: {
      ...styles.settingValueDisplay,
      backgroundColor: 'rgba(0, 122, 255, 0.12)',
      borderColor: 'rgba(0, 122, 255, 0.2)',
    },
    iconContainer: {
      ...styles.iconContainer,
      backgroundColor: 'rgba(0, 122, 255, 0.15)',
    },
    switchContainer: {
      ...styles.switchContainer,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    modalOverlay: {
      ...styles.modalOverlay,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
      ...styles.modalContent,
      backgroundColor: '#FFFFFF',
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 20,
    },
    modalHeader: {
      ...styles.modalHeader,
      backgroundColor: '#F8F9FA',
      borderBottomColor: '#E9ECEF',
    },
    modalTitle: {
      ...styles.modalTitle,
      color: '#1C1C1E',
    },
    modalCloseButton: {
      ...styles.modalCloseButton,
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    modalCloseText: {
      ...styles.modalCloseText,
      color: '#000000',
    },
    nLevelOption: {
      ...styles.nLevelOption,
      backgroundColor: '#F8F9FA',
      borderWidth: 1,
      borderColor: '#E9ECEF',
    },
    nLevelOptionText: {
      ...styles.nLevelOptionText,
      color: '#1C1C1E',
    },
    nLevelOptionTextLocked: {
      ...styles.nLevelOptionTextLocked,
      color: '#999',
    },
    premiumBadge: {
      ...styles.premiumBadge,
      backgroundColor: 'rgba(255, 215, 0, 0.2)',
      borderColor: 'rgba(255, 215, 0, 0.4)',
    },
    premiumButton: {
      ...styles.premiumButton,
      backgroundColor: '#FFD700',
      borderColor: '#FFA500',
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
          <Text style={dynamicStyles.title}>{t.settings.title}</Text>
          <Text style={dynamicStyles.subtitle}>{t.settings.subtitle}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t.settings.trainingSettings}</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, dynamicStyles.settingRow]}
            onPress={() => setShowNLevelModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>⚙️</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.fixedNLevel}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.fixedNDescription}</Text>
                {!settings.isPremium && settings.fixedN > 2 && (
                  <View style={styles.premiumBadgeContainer}>
                    <Text style={dynamicStyles.premiumBadge}>{t.settings.premiumTrial}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={dynamicStyles.settingValueContainer}>
              <Text style={dynamicStyles.settingValue}>N={settings.fixedN}</Text>
              <Text style={[styles.settingArrow, dynamicStyles.settingValue]}>›</Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>🎯</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.adaptiveNLevel}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.adaptiveNDescription}</Text>
              </View>
            </View>
            <View style={dynamicStyles.settingValueDisplay}>
              <Text style={dynamicStyles.settingValue}>{settings.initialN}</Text>
            </View>
          </View>
          
          <View style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>🔢</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>Trial Count</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>Number of trials per session</Text>
              </View>
            </View>
            <View style={dynamicStyles.settingValueDisplay}>
              <Text style={dynamicStyles.settingValue}>{settings.trialCount}</Text>
            </View>
          </View>
          
          <View style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>⏱️</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>Stimulus Duration</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>How long each stimulus is shown</Text>
              </View>
            </View>
            <View style={dynamicStyles.settingValueDisplay}>
              <Text style={dynamicStyles.settingValue}>{settings.stimulusDuration}ms</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t.settings.audioFeedback}</Text>
          
          <View style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>🔊</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.soundEnabled}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.soundDescription}</Text>
              </View>
            </View>
            <View style={dynamicStyles.switchContainer}>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSettings({ soundEnabled: value })}
                trackColor={{ false: '#E9E9EA', true: '#007AFF' }}
                thumbColor={settings.soundEnabled ? '#FFF' : '#F2F2F2'}
                ios_backgroundColor="#E9E9EA"
              />
            </View>
          </View>
          
          <View style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>📳</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.vibration}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.vibrationDescription}</Text>
              </View>
            </View>
            <View style={dynamicStyles.switchContainer}>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
                trackColor={{ false: '#E9E9EA', true: '#007AFF' }}
                thumbColor={settings.vibrationEnabled ? '#FFF' : '#F2F2F2'}
                ios_backgroundColor="#E9E9EA"
              />
            </View>
          </View>
          
          <View style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>🔤</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.showLetters}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.showLettersDescription}</Text>
              </View>
            </View>
            <View style={dynamicStyles.switchContainer}>
              <Switch
                value={settings.showLetters}
                onValueChange={(value) => updateSettings({ showLetters: value })}
                trackColor={{ false: '#E9E9EA', true: '#007AFF' }}
                thumbColor={settings.showLetters ? '#FFF' : '#F2F2F2'}
                ios_backgroundColor="#E9E9EA"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t.settings.appearance}</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, dynamicStyles.settingRow]}
            onPress={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>{settings.theme === 'dark' ? '🌙' : '☀️'}</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.theme}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.themeDescription}</Text>
              </View>
            </View>
            <View style={dynamicStyles.settingValueContainer}>
              <Text style={dynamicStyles.settingValue}>{settings.theme === 'dark' ? t.general.dark : t.general.light}</Text>
              <Text style={[styles.settingArrow, dynamicStyles.settingValue]}>›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, dynamicStyles.settingRow]}
            onPress={() => setShowLanguageModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingRowContent}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.settingIcon}>🌍</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>{t.settings.language}</Text>
                <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>{t.settings.languageDescription}</Text>
              </View>
            </View>
            <View style={dynamicStyles.settingValueContainer}>
              <Text style={dynamicStyles.settingValue}>{settings.language === 'ja' ? t.general.japanese : t.general.english}</Text>
              <Text style={[styles.settingArrow, dynamicStyles.settingValue]}>›</Text>
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
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>{t.settings.selectNLevel}</Text>
              <TouchableOpacity 
                style={dynamicStyles.modalCloseButton}
                onPress={() => setShowNLevelModal(false)}
              >
                <Text style={dynamicStyles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={nLevelOptions}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    dynamicStyles.nLevelOption,
                    settings.fixedN === item.value && styles.nLevelOptionSelected,
                    item.premium && !settings.isPremium && styles.nLevelOptionLocked
                  ]}
                  onPress={() => handleNLevelSelect(item.value, item.premium)}
                >
                  <View style={styles.nLevelOptionContent}>
                    <Text style={[
                      dynamicStyles.nLevelOptionText,
                      settings.fixedN === item.value && styles.nLevelOptionTextSelected,
                      item.premium && !settings.isPremium && dynamicStyles.nLevelOptionTextLocked
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
                style={dynamicStyles.premiumButton}
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
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>{t.settings.language}</Text>
              <TouchableOpacity 
                style={dynamicStyles.modalCloseButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={dynamicStyles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languageOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    dynamicStyles.nLevelOption,
                    settings.language === item.value && styles.nLevelOptionSelected,
                  ]}
                  onPress={() => handleLanguageSelect(item.value as 'ja' | 'en')}
                >
                  <View style={styles.nLevelOptionContent}>
                    <Text style={[
                      dynamicStyles.nLevelOptionText,
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
    paddingVertical: 50,
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
    marginBottom: 24,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#007AFF',
    marginBottom: 20,
    marginTop: 32,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 12,
    minHeight: 72,
    borderWidth: 0,
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIcon: {
    fontSize: 22,
    textAlign: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  settingValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#007AFF',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  settingValueDisplay: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  switchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 4,
    borderRadius: 20,
  },
  settingArrow: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '700',
  },
  premiumBadgeContainer: {
    marginTop: 8,
  },
  premiumBadge: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '800',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
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