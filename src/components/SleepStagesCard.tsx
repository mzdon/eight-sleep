import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {
  Duration,
  DurationType,
  getIntervalDataPointsWithinDuration,
} from '../utils';
import Card from './Card';
import SleepStagesChart from './SleepStagesChart';
import Spacer from './Spacer';

export interface SleepStagesCardProps {
  duration: Duration;
  durationType: DurationType;
  sleepData: UserSleepData | null;
}

const SleepStagesCard = ({
  duration,
  durationType,
  sleepData,
}: SleepStagesCardProps) => {
  const data = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'stages',
  );
  return (
    <Card>
      <Text variant="headlineSmall">Stages</Text>
      <Spacer scale={0.5} />
      <SleepStagesChart
        duration={duration}
        durationType={durationType}
        data={data}
      />
    </Card>
  );
};

export default SleepStagesCard;
