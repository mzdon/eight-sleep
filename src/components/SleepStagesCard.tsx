import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, getIntervalDataPointsWithinDuration} from '../utils';
import Card from './Card';

export interface SleepStagesCardProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

const SleepStagesCard = ({duration, sleepData}: SleepStagesCardProps) => {
  const data = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'stages',
  ).flat();
  return (
    <Card>
      <Text variant="headlineSmall">Sleep Stages</Text>
      <Text>{!data.length ? 'No data!' : JSON.stringify(data)}</Text>
    </Card>
  );
};

export default SleepStagesCard;
