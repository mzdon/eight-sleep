import {MD3LightTheme} from 'react-native-paper';
import {getBaseTheme, THEME_VERSION} from './base';
import {Theme} from './types';

const getLightTheme = (reduceMotion: boolean) => {
  const baseTheme = getBaseTheme(reduceMotion);
  const lightTheme: Theme = {
    ...baseTheme,
    dark: false,
    version: THEME_VERSION,
    isV3: true,
    colors: {
      ...MD3LightTheme.colors,
    },
    fonts: {
      ...MD3LightTheme.fonts,
    },
  };
  return lightTheme;
};

export {getLightTheme};
