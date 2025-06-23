# Dual N-Back Cognitive Trainer

A React Native app built with Expo that provides dual N-back training for working memory enhancement.

## Features

- **Dual N-Back Training**: Simultaneous visual and auditory stimuli
- **Adaptive Algorithm**: Automatically adjusts difficulty based on performance
- **Fixed Mode**: Train at a specific N-level
- **Performance Tracking**: Statistics and progress monitoring
- **Modern UI**: Dark theme with intuitive controls
- **Cross-platform**: iOS, Android, and Web support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Development

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home screen
│   ├── stats.tsx     # Statistics screen
│   └── settings.tsx  # Settings screen
└── training/         # Training screens
    └── [mode].tsx    # Dynamic training screen

components/
├── nback/           # N-back specific components
│   ├── Grid.tsx     # 3x3 visual grid
│   ├── StimulusAudio.tsx
│   ├── ResponseButtons.tsx
│   └── TrainingHeader.tsx
└── ui/              # Reusable UI components
    ├── PrimaryButton.tsx
    └── ProgressBar.tsx

store/               # Zustand state management
├── trainingStore.ts # Training state
└── settingsStore.ts # User settings

hooks/               # Custom React hooks
├── useTraining.ts   # Training logic
└── useStimuli.ts    # Stimulus generation

utils/
└── adaptiveAlgorithm.ts # N-level adaptation logic
```

## How It Works

### Dual N-Back Task

The app presents two types of stimuli simultaneously:
- **Visual**: A blue square appears in one of 9 positions on a 3x3 grid
- **Auditory**: A letter (A-Z) is spoken aloud

Users must respond when the current stimulus matches the one from N steps back:
- Press "VISUAL" if the current position matches the position from N trials ago
- Press "AUDIO" if the current letter matches the letter from N trials ago

### Adaptive Algorithm

The app automatically adjusts difficulty based on performance:
- If accuracy ≥ 80% over the last 8 trials → increase N-level
- If accuracy ≤ 50% over the last 8 trials → decrease N-level
- N-level ranges from 1 to 9

## Settings

- **Initial N-Level**: Starting difficulty (default: 2)
- **Trial Count**: Number of trials per session (default: 20)
- **Stimulus Duration**: How long each stimulus is shown (default: 1000ms)
- **Sound/Vibration**: Enable/disable audio and haptic feedback

## License

MIT License - see LICENSE file for details