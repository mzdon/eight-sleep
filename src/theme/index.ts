import {ColorSchemeName, useColorScheme} from 'react-native';
import {useReduceMotion} from '../utils';
import {getDarkTheme} from './dark';
import {getLightTheme} from './light';

const getTheme = (colorScheme: ColorSchemeName, reduceMotion = false) => {
  return colorScheme === 'dark'
    ? getDarkTheme(reduceMotion)
    : getLightTheme(reduceMotion);
};

const useTheme = () => {
  const colorScheme = useColorScheme();
  const reduceMotion = useReduceMotion();
  return getTheme(colorScheme, reduceMotion);
};

export {getTheme, useTheme};
