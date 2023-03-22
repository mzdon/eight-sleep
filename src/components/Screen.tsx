import React from 'react';
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {SPACING, useTheme} from '../theme';

export type ScreenProps = SafeAreaViewProps;

const styles = StyleSheet.create({
  safeAreaView: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: SPACING,
  },
});

const Screen = ({children, style, ...rest}: ScreenProps) => {
  const theme = useTheme();
  const {
    colors: {background: backgroundColor},
  } = theme;
  const backgroundStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <SafeAreaView
      style={[backgroundStyle, styles.safeAreaView, style]}
      {...rest}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
