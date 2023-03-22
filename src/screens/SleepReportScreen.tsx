import React from 'react';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet} from 'react-native';
import {use} from '@stated-library/react';
import {Header} from '../components';
import {UserSleepData} from '../state/sleep';
import {useTheme} from '../theme';
import appState$ from '../state';
import SplashScreen from './SplashScreen';

export interface SleepReportScreenProps {
  data: UserSleepData;
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
  },
  splashScreen: {
    opacity: 0.5,
  },
});

const SleepReportScreen = () => {
  const {
    sleepData,
    sleep: {isFetching},
  } = use(appState$);
  const {
    colors: {background: backgroundColor},
  } = useTheme();
  return (
    <SafeAreaView>
      <Header />
      <ScrollView style={[{backgroundColor}, styles.scrollView]}>
        <Text variant="headlineMedium">Sleep Report Screen</Text>
        <Text variant="bodyLarge">{JSON.stringify(sleepData)}</Text>
      </ScrollView>
      {isFetching && <SplashScreen style={styles.splashScreen} />}
    </SafeAreaView>
  );
};

export default SleepReportScreen;
