import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, getIntervalDataPointsWithinDuration} from '../utils';
import Card from './Card';

export interface HealthIndicatorsProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

interface Data {
  heart: [string, [string, number][]][];
  respiratory: [string, [string, number][]][];
}

function determineData(
  sleepData: UserSleepData | null,
  duration: Duration,
): Data {
  const timeseries = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'timeseries',
  );
  let data: Data = {heart: [], respiratory: []};
  return timeseries.reduce((curr, next) => {
    return {
      heart: [...curr.heart, [next[0], next[1].heartRate]],
      respiratory: [...curr.respiratory, [next[0], next[1].respiratoryRate]],
    };
  }, data);
}

const HealthIndicators = ({sleepData, duration}: HealthIndicatorsProps) => {
  const {heart, respiratory} = determineData(sleepData, duration);
  return (
    <Card>
      <Text variant="headlineSmall">Health Indicators</Text>
      <Text>
        {!heart.length && !respiratory.length
          ? 'No data!'
          : JSON.stringify({heart, respiratory})}
      </Text>
    </Card>
  );
};

export default HealthIndicators;
