// Translation system for N-Back Trainer

export interface Translations {
  // Home Screen
  home: {
    title: string;
    subtitle: string;
    rulesTitle: string;
    rulesText: string;
    adaptiveTitle: string;
    adaptiveSubtext: string;
    adaptiveDetail: string;
    fixedTitle: string;
    fixedSubtext: string;
    fixedDetail: string;
  };
  
  // Training Screens
  training: {
    adaptive: string;
    fixed: string;
    level: string;
    trial: string;
    score: string;
    waitMessage: string;
    detectMessage: string;
    positionButton: string;
    letterButton: string;
    startButton: string;
    stopButton: string;
    backButton: string;
    sessionComplete: string;
    accuracy: string;
    correct: string;
    continue: string;
    backToHome: string;
    levelUp: string;
    levelDown: string;
  };
  
  // Settings Screen
  settings: {
    title: string;
    subtitle: string;
    trainingSettings: string;
    fixedNLevel: string;
    fixedNDescription: string;
    adaptiveNLevel: string;
    adaptiveNDescription: string;
    audioFeedback: string;
    soundEnabled: string;
    soundDescription: string;
    vibration: string;
    vibrationDescription: string;
    showLetters: string;
    showLettersDescription: string;
    appearance: string;
    theme: string;
    themeDescription: string;
    language: string;
    languageDescription: string;
    premiumTrial: string;
    selectNLevel: string;
    premiumFeature: string;
    premiumUpgrade: string;
    premiumPrice: string;
    cancel: string;
    ok: string;
    developmentMode: string;
    freeTrialMessage: string;
  };
  
  // N-Level Options
  nLevels: {
    n1: string;
    n2: string;
    n3: string;
    n4: string;
    n5: string;
    n6: string;
    n7: string;
    n8: string;
    n9: string;
  };
  
  // Stats Screen
  stats: {
    title: string;
    subtitle: string;
    performanceOverview: string;
    bestNLevel: string;
    totalSessions: string;
    averageAccuracy: string;
    timeOfDayPerformance: string;
    recentSessions: string;
    noDataMessage: string;
    duration: string;
    sessions: string;
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  
  // General
  general: {
    dark: string;
    light: string;
    japanese: string;
    english: string;
  };
}

export const translations: Record<'ja' | 'en', Translations> = {
  ja: {
    home: {
      title: 'N-BackShift',
      subtitle: '記憶力と集中力を鍛える認知トレーニング',
      rulesTitle: 'ゲームのルール',
      rulesText: '位置と文字を記憶して、N個前に出た内容と同じものを見つけよう！',
      adaptiveTitle: '🧠 適応型トレーニング',
      adaptiveSubtext: 'あなたのレベルに合わせて難易度が自動調整',
      adaptiveDetail: '',
      fixedTitle: '⚡ 固定型トレーニング',
      fixedSubtext: 'つ前に出た内容と比較する一定難易度',
      fixedDetail: '',
    },
    training: {
      adaptive: '適応型 N-BackShift トレーニング',
      fixed: '固定型 N-BackShift トレーニング',
      level: 'N-レベル',
      trial: '試行',
      score: 'スコア',
      waitMessage: '試行後に応答可能...',
      detectMessage: 'マッチを検出したらボタンを押してください',
      positionButton: '🎯 位置',
      letterButton: '🔤 文字',
      startButton: 'トレーニング開始',
      stopButton: '停止',
      backButton: 'ホームに戻る',
      sessionComplete: 'セッション完了！',
      accuracy: '正解率',
      correct: '正解',
      continue: '続ける',
      backToHome: 'ホームに戻る',
      levelUp: 'レベルアップ！',
      levelDown: 'レベルダウン',
    },
    settings: {
      title: '設定',
      subtitle: 'トレーニングをカスタマイズ',
      trainingSettings: 'トレーニング設定',
      fixedNLevel: '固定型 N-レベル',
      fixedNDescription: '難易度設定',
      adaptiveNLevel: '適応型 初期N-レベル',
      adaptiveNDescription: '適応トレーニングの開始難易度',
      audioFeedback: '音声・フィードバック',
      soundEnabled: '音声有効',
      soundDescription: '文字の音声再生',
      vibration: '振動',
      vibrationDescription: '応答時の触覚フィードバック',
      showLetters: '文字表示',
      showLettersDescription: '音声刺激時に文字を画面に表示',
      appearance: '外観',
      theme: 'テーマ',
      themeDescription: 'アプリの外観',
      language: '言語',
      languageDescription: 'アプリの表示言語',
      premiumTrial: '🔓 プレミアム体験中',
      selectNLevel: '固定型 N-レベル選択',
      premiumFeature: 'プレミアム機能',
      premiumUpgrade: '🚀 プレミアムにアップグレード',
      premiumPrice: '月額300円でN=4-9を解除',
      cancel: 'キャンセル',
      ok: 'OK',
      developmentMode: '開発中',
      freeTrialMessage: 'プレミアム機能は現在開発中です。\n\n今回は無料でN=4-9をお試しできます！',
    },
    nLevels: {
      n1: 'N=1 (超簡単)',
      n2: 'N=2 (簡単)',
      n3: 'N=3 (普通)',
      n4: 'N=4 (難しい)',
      n5: 'N=5 (とても難しい)',
      n6: 'N=6 (上級者)',
      n7: 'N=7 (エキスパート)',
      n8: 'N=8 (マスター)',
      n9: 'N=9 (伝説)',
    },
    stats: {
      title: '統計',
      subtitle: 'トレーニング進捗',
      performanceOverview: 'パフォーマンス概要',
      bestNLevel: '最高N-レベル',
      totalSessions: '総セッション数',
      averageAccuracy: '平均正解率',
      timeOfDayPerformance: '時間帯別パフォーマンス',
      recentSessions: '最近のセッション',
      noDataMessage: 'まだセッションデータがありません。\nトレーニングを開始して統計を記録しましょう！',
      duration: '時間',
      sessions: '回',
      morning: '朝',
      afternoon: '昼',
      evening: '夕方',
      night: '夜',
    },
    general: {
      dark: 'ダーク',
      light: 'ライト',
      japanese: '日本語',
      english: 'English',
    },
  },
  
  en: {
    home: {
      title: 'N-BackShift',
      subtitle: 'Cognitive training to improve memory and focus',
      rulesTitle: 'Game Rules',
      rulesText: 'Remember positions and letters, then find matches from N trials back!',
      adaptiveTitle: '🧠 Adaptive Training',
      adaptiveSubtext: 'Difficulty automatically adjusts to your performance',
      adaptiveDetail: '',
      fixedTitle: '⚡ Fixed Training',
      fixedSubtext: ' trials back at consistent difficulty',
      fixedDetail: '',
    },
    training: {
      adaptive: 'Adaptive N-BackShift Training',
      fixed: 'Fixed N-BackShift Training',
      level: 'N-Level',
      trial: 'Trial',
      score: 'Score',
      waitMessage: ' trials to respond...',
      detectMessage: 'Press buttons if you detect a match',
      positionButton: '🎯 POSITION',
      letterButton: '🔤 LETTER',
      startButton: 'START TRAINING',
      stopButton: 'STOP',
      backButton: 'Back to Home',
      sessionComplete: 'Session Complete!',
      accuracy: 'Accuracy',
      correct: 'Correct',
      continue: 'Continue',
      backToHome: 'Back to Home',
      levelUp: 'Level Up!',
      levelDown: 'Level Down',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Customize Your Training',
      trainingSettings: 'Training Settings',
      fixedNLevel: 'Fixed N-Level',
      fixedNDescription: 'Difficulty setting',
      adaptiveNLevel: 'Adaptive Initial N-Level',
      adaptiveNDescription: 'Starting difficulty for adaptive training',
      audioFeedback: 'Audio & Feedback',
      soundEnabled: 'Sound Enabled',
      soundDescription: 'Play audio letters',
      vibration: 'Vibration',
      vibrationDescription: 'Haptic feedback on responses',
      showLetters: 'Show Letters',
      showLettersDescription: 'Display letters on screen during audio stimulus',
      appearance: 'Appearance',
      theme: 'Theme',
      themeDescription: 'App appearance',
      language: 'Language',
      languageDescription: 'App display language',
      premiumTrial: '🔓 Premium Trial',
      selectNLevel: 'Select Fixed N-Level',
      premiumFeature: 'Premium Feature',
      premiumUpgrade: '🚀 Upgrade to Premium',
      premiumPrice: '$3/month to unlock N=4-9',
      cancel: 'Cancel',
      ok: 'OK',
      developmentMode: 'In Development',
      freeTrialMessage: 'Premium features are currently in development.\n\nEnjoy a free trial of N=4-9 levels!',
    },
    nLevels: {
      n1: 'N=1 (Very Easy)',
      n2: 'N=2 (Easy)',
      n3: 'N=3 (Normal)',
      n4: 'N=4 (Hard)',
      n5: 'N=5 (Very Hard)',
      n6: 'N=6 (Expert)',
      n7: 'N=7 (Master)',
      n8: 'N=8 (Grandmaster)',
      n9: 'N=9 (Legendary)',
    },
    stats: {
      title: 'Statistics',
      subtitle: 'Training Progress',
      performanceOverview: 'Performance Overview',
      bestNLevel: 'Best N-Level',
      totalSessions: 'Total Sessions',
      averageAccuracy: 'Average Accuracy',
      timeOfDayPerformance: 'Performance by Time of Day',
      recentSessions: 'Recent Sessions',
      noDataMessage: 'No session data yet.\nStart training to record statistics!',
      duration: 'Duration',
      sessions: 'sessions',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night',
    },
    general: {
      dark: 'Dark',
      light: 'Light',
      japanese: '日本語',
      english: 'English',
    },
  },
};

// Hook to get translations
export function useTranslations(language: 'ja' | 'en' = 'ja') {
  return translations[language];
}