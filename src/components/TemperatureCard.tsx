import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, getIntervalDataPointsWithinDuration} from '../utils';
import Card from './Card';
import Spacer from './Spacer';
import TemperatureChart from './TemperatureChart';

export interface TemperatureCardProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

const TemperatureCard = ({sleepData, duration}: TemperatureCardProps) => {
  const data = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'timeseries',
  );
  return (
    <Card>
      <Text variant="headlineSmall">Tempurature</Text>
      <Spacer scale={0.5} />
      <TemperatureChart data={data} />
    </Card>
  );
};

export default TemperatureCard;
