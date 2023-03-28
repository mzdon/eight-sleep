import React, {useCallback} from 'react';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet} from 'react-native';
import {use} from '@stated-library/react';
import {
  DurationTypeSelector,
  Header,
  HealthIndicators,
  SleepStagesCard,
  Spacer,
  TemperatureCard,
} from '../../components';
import {SPACING, useTheme} from '../../theme';
import appState$ from '../../state';
import SplashScreen from '../SplashScreen';
import useSleepReportReducer, {setDurationTypeAction} from './reducer';
import {useSelectNextDuration, useSelectPreviousDuration} from './hooks';
import {DurationType} from '../../utils';
import SleepScoreCard from '../../components/SleepScoreCard';
import {useNetworkErrorSnack} from '../../components/Errors';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING,
  },
  splashScreen: {
    opacity: 0.5,
  },
});

const SleepReportScreen = () => {
  const {
    sleepData,
    sleep: {isFetching, requestError},
  } = use(appState$);
  const {
    colors: {background: backgroundColor},
  } = useTheme();

  // Error notification
  const Snack = useNetworkErrorSnack(requestError);

  // UI state for selected duration and duration type
  const [state, dispatch] = useSleepReportReducer(sleepData);
  const {selectedDuration, durationType} = state;

  // UI action handling
  const selectDurationType = useCallback(
    (nextDurationType: DurationType) => {
      dispatch(setDurationTypeAction(nextDurationType));
    },
    [dispatch],
  );
  const selectNextDuration = useSelectNextDuration(
    selectedDuration,
    sleepData,
    dispatch,
  );
  const selectPreviousDuration = useSelectPreviousDuration(
    selectedDuration,
    sleepData,
    dispatch,
  );

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor}]}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <Spacer />
        <Text variant="headlineMedium">Sleep Report</Text>
        <Spacer />
        <DurationTypeSelector
          durationType={durationType}
          selectDurationType={selectDurationType}
        />
        <Spacer />
        <SleepScoreCard
          selectedDuration={selectedDuration}
          selectNextDuration={selectNextDuration}
          selectPreviousDuration={selectPreviousDuration}
          durationType={durationType}
          sleepData={sleepData}
        />
        <Spacer />
        <SleepStagesCard
          duration={selectedDuration}
          durationType={durationType}
          sleepData={sleepData}
        />
        <Spacer />
        <TemperatureCard duration={selectedDuration} sleepData={sleepData} />
        <Spacer />
        <HealthIndicators duration={selectedDuration} sleepData={sleepData} />
        <Spacer scale={2} />
      </ScrollView>
      <Snack />
      {isFetching && <SplashScreen style={styles.splashScreen} />}
    </SafeAreaView>
  );
};

export default SleepReportScreen;
