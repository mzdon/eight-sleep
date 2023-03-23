import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {Duration, getIntervalDataPointsWithinDuration} from '../utils';

export interface SleepScoreProps {
  duration: Duration;
  sleepData: UserSleepData | null;
}

function formatScore(score: number) {
  return `${Math.floor(score)}%`;
}

function determineScoreDisplay(sleepData: UserSleepData, duration: Duration) {
  const data = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'score',
  );
  if (!data.length) {
    return 'No data!';
  }
  const sum = data.reduce((curr, next) => {
    return curr + next;
  }, 0);
  return formatScore(sum / data.length);
}

const SleepScore = ({duration, sleepData}: SleepScoreProps) => {
  const score = sleepData
    ? determineScoreDisplay(sleepData, duration)
    : 'No data!';
  return <Text variant="displayLarge">{score}</Text>;
};

export default SleepScore;
