import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Screen} from '../components';

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignContent: 'center',
  },
});

const SplashScreen = () => {
  return (
    <Screen style={styles.screen}>
      <ActivityIndicator />
    </Screen>
  );
};

export default SplashScreen;
