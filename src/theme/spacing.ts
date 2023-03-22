import {Platform, StatusBar} from 'react-native';

export const SPACING = 10;
export const STATUS_BAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
