import {MD3DarkTheme} from 'react-native-paper';
import {getBaseTheme, THEME_VERSION} from './base';
import {Theme} from './types';

const getDarkTheme = (reduceMotion: boolean) => {
  const baseTheme = getBaseTheme(reduceMotion);
  const darkTheme: Theme = {
    ...baseTheme,
    dark: false,
    version: THEME_VERSION,
    isV3: true,
    colors: {
      ...MD3DarkTheme.colors,
    },
    fonts: {
      ...MD3DarkTheme.fonts,
    },
  };
  return darkTheme;
};

export {getDarkTheme};
