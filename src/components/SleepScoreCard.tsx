import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, DurationType} from '../utils';
import Card from './Card';
import DurationDate from './DurationDate';
import NextDurationButton from './NextDurationButton';
import PreviousDurationButton from './PreviousDurationButton';
import SleepScore from './SleepScore';

export interface SleepScoreCardProps {
  selectedDuration: Duration;
  selectNextDuration: (() => void) | null;
  selectPreviousDuration: (() => void) | null;
  durationType: DurationType;
  sleepData: UserSleepData | null;
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const SleepScoreCard = ({
  selectedDuration,
  selectNextDuration,
  selectPreviousDuration,
  durationType,
  sleepData,
}: SleepScoreCardProps) => {
  return (
    <Card>
      <Text variant="headlineSmall">Sleep Score</Text>
      <DurationDate duration={selectedDuration} durationType={durationType} />
      <View style={styles.view}>
        <PreviousDurationButton onPress={selectPreviousDuration} />
        <SleepScore duration={selectedDuration} sleepData={sleepData} />
        <NextDurationButton onPress={selectNextDuration} />
      </View>
    </Card>
  );
};

export default SleepScoreCard;
