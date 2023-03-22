import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {Screen} from '../components';

export interface SplashScreenProps {
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignContent: 'center',
  },
});

const SplashScreen = ({style}: SplashScreenProps) => {
  return (
    <Screen style={[styles.screen, style]}>
      <ActivityIndicator />
    </Screen>
  );
};

export default SplashScreen;
