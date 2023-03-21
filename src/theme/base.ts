import {ThemeBase} from 'react-native-paper';

export const THEME_VERSION = 3;
export const THEME_MODE = 'adaptive';
export const THEME_ROUNDNESS = 4;
export const THEME_ANIMATION_SCALE = 2;

export const getBaseTheme = (reduceMotion: boolean) => {
  const baseTheme: ThemeBase = {
    dark: false,
    mode: THEME_MODE,
    roundness: THEME_ROUNDNESS,
    animation: {
      scale: reduceMotion ? 0 : THEME_ANIMATION_SCALE,
    },
  };
  return baseTheme;
};
