
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0066cc';
const tintColorDark = '#4da6ff';

export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#4a4a4a',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#f5f5f5',
    background: '#121212',
    tint: tintColorDark,
    icon: '#e0e0e0',
    tabIconDefault: '#a0a0a0',
    tabIconSelected: tintColorDark,
  },
};
