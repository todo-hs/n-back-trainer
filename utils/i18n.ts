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
      title: 'Dual N-Back Trainer',
      subtitle: '記憶力と集中力を鍛える認知トレーニング',
      rulesTitle: 'ゲームのルール',
      rulesText: '位置と文字を記憶して、N個前に出た内容と同じものを見つけよう！',
      adaptiveTitle: '🧠 適応型トレーニング',
      adaptiveSubtext: 'あなたのレベルに合わせて難易度が自動調整',
      adaptiveDetail: '初心者〜上級者まで対応',
      fixedTitle: '⚡ 固定型トレーニング',
      fixedSubtext: 'つ前に出た内容と比較する一定難易度',
      fixedDetail: '基礎練習・安定した訓練に最適',
    },
    training: {
      adaptive: '適応型 N-Back トレーニング',
      fixed: '固定型 N-Back トレーニング',
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
      fixedNDescription: '固定トレーニングの難易度設定',
      adaptiveNLevel: '適応型 初期N-レベル',
      adaptiveNDescription: '適応トレーニングの開始難易度',
      audioFeedback: '音声・フィードバック',
      soundEnabled: '音声有効',
      soundDescription: '文字の音声再生',
      vibration: '振動',
      vibrationDescription: '応答時の触覚フィードバック',
      appearance: '外観',
      theme: 'テーマ',
      themeDescription: 'アプリの外観',
      language: '言語',
      languageDescription: 'アプリの表示言語',
      premiumTrial: '🔓 プレミアム体験中',
      selectNLevel: '固定型 N-レベル選択',
      premiumFeature: 'プレミアム機能',
      premiumUpgrade: '🚀 プレミアムにアップグレード',
      premiumPrice: '月額300円でN=3-9を解除',
      cancel: 'キャンセル',
      ok: 'OK',
      developmentMode: '開発中',
      freeTrialMessage: 'プレミアム機能は現在開発中です。\n\n今回は無料でN=3-9をお試しできます！',
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
    general: {
      dark: 'ダーク',
      light: 'ライト',
      japanese: '日本語',
      english: 'English',
    },
  },
  
  en: {
    home: {
      title: 'Dual N-Back Trainer',
      subtitle: 'Cognitive training to improve memory and focus',
      rulesTitle: 'Game Rules',
      rulesText: 'Remember positions and letters, then find matches from N trials back!',
      adaptiveTitle: '🧠 Adaptive Training',
      adaptiveSubtext: 'Difficulty automatically adjusts to your performance',
      adaptiveDetail: 'Suitable for beginners to experts',
      fixedTitle: '⚡ Fixed Training',
      fixedSubtext: ' trials back at consistent difficulty',
      fixedDetail: 'Perfect for basic practice and stable training',
    },
    training: {
      adaptive: 'Adaptive N-Back Training',
      fixed: 'Fixed N-Back Training',
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
      fixedNDescription: 'Difficulty setting for fixed training',
      adaptiveNLevel: 'Adaptive Initial N-Level',
      adaptiveNDescription: 'Starting difficulty for adaptive training',
      audioFeedback: 'Audio & Feedback',
      soundEnabled: 'Sound Enabled',
      soundDescription: 'Play audio letters',
      vibration: 'Vibration',
      vibrationDescription: 'Haptic feedback on responses',
      appearance: 'Appearance',
      theme: 'Theme',
      themeDescription: 'App appearance',
      language: 'Language',
      languageDescription: 'App display language',
      premiumTrial: '🔓 Premium Trial',
      selectNLevel: 'Select Fixed N-Level',
      premiumFeature: 'Premium Feature',
      premiumUpgrade: '🚀 Upgrade to Premium',
      premiumPrice: '$3/month to unlock N=3-9',
      cancel: 'Cancel',
      ok: 'OK',
      developmentMode: 'In Development',
      freeTrialMessage: 'Premium features are currently in development.\n\nEnjoy a free trial of N=3-9 levels!',
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