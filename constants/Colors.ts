
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2E86C1';
const tintColorDark = '#5DADE2';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    cardBackground: '#ffffff',
    border: '#e0e0e0',
    secondary: '#f8f9fa',
    accent: '#3498db',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    muted: '#6c757d',
  },
  dark: {
    text: '#ECEDEE',
    background: '#1a1a1a',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    cardBackground: '#2c2c2c',
    border: '#404040',
    secondary: '#2a2a2a',
    accent: '#5dade2',
    success: '#2ecc71',
    warning: '#f1c40f',
    error: '#e74c3c',
    muted: '#adb5bd',
  },
};
