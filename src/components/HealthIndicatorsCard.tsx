import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, getIntervalDataPointsWithinDuration} from '../utils';
import Card from './Card';
import HealthIndicatorsChart from './HealthIndicatorsChart';
import Spacer from './Spacer';

export interface HealthIndicatorsProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

const HealthIndicators = ({sleepData, duration}: HealthIndicatorsProps) => {
  const data = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'timeseries',
  );
  return (
    <Card>
      <Text variant="headlineSmall">Health Indicators</Text>
      <Spacer scale={0.5} />
      <HealthIndicatorsChart data={data} />
    </Card>
  );
};

export default HealthIndicators;
