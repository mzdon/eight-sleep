import {Platform, StatusBar} from 'react-native';

export const SPACING = 20;
export const PRESSABLE_DIMENSION = SPACING * 1.5;
export const PADDING = SPACING * 0.7;
export const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
