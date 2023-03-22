import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';
import {SPACING, useTheme} from '../theme';

export type ScreenProps = SafeAreaViewProps;

const Screen = ({children, style, ...rest}: ScreenProps) => {
  const theme = useTheme();
  const {
    colors: {background: backgroundColor},
  } = theme;
  const backgroundStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: backgroundColor,
    paddingHorizontal: SPACING,
  };

  return (
    <SafeAreaView style={[backgroundStyle, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
