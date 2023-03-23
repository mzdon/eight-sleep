import moment from 'moment';
import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration} from '../utils';

export interface SleepScoreProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

function determineScore(sleepData: UserSleepData, duration: Duration) {
  const lowerBound = moment(duration[0]);
  const upperBound = moment(duration[1]);
  const dataPoints = sleepData.intervals
    .filter(({ts}) =>
      moment(ts).isBetween(lowerBound, upperBound, undefined, '[]'),
    )
    .map(({score}) => score);
  if (!dataPoints.length) {
    return 0;
  }
  const sum = dataPoints.reduce((curr, next) => {
    return curr + next;
  }, 0);
  return sum / dataPoints.length;
}

function formatScore(score: number) {
  return `${Math.floor(score)}%`;
}

const SleepScore = ({duration, sleepData}: SleepScoreProps) => {
  const score = sleepData ? determineScore(sleepData, duration) : 0;
  return <Text variant="displayLarge">{formatScore(score)}</Text>;
};

export default SleepScore;
