import React, {PropsWithChildren} from 'react';
import {ScrollView, ScrollViewProps} from 'react-native';
import {SPACING} from '../theme';
import Screen, {ScreenProps} from './Screen';

export type ScrollScreenProps = PropsWithChildren<{
  containerProps?: Omit<ScreenProps, 'children'>;
}> &
  ScrollViewProps;

const styles = {
  screen: {
    paddingHorizontal: 0,
  },
  scrollView: {
    paddingHorizontal: SPACING,
  },
};

const ScrollScreen = ({
  children,
  containerProps,
  style,
  ...rest
}: ScrollScreenProps) => {
  return (
    <Screen {...containerProps} style={[styles.screen, containerProps?.style]}>
      <ScrollView style={[styles.scrollView, style]} {...rest}>
        {children}
      </ScrollView>
    </Screen>
  );
};

export default ScrollScreen;
