
/**
 * Modern color scheme with proper contrast ratios for accessibility
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#1D1D1F',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#48484A',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    cardBackground: '#F2F2F7',
    border: '#E5E5EA',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    secondary: '#8E8E93',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#AEAEB2',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    cardBackground: '#1C1C1E',
    border: '#38383A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    secondary: '#8E8E93',
  },
};
