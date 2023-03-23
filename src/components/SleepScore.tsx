import moment from 'moment';
import React from 'react';
import {Text} from 'react-native-paper';
import {UserSleepData} from '../state/sleep';
import {
  Duration,
  DurationType,
  getIntervalDataPointsWithinDuration,
  getMomentIteratorFromDuration,
} from '../utils';
import BarChart from './BarChart';
import NoData from './NoData';
import ProgressChart from './ProgressChart';

export interface SleepScoreProps {
  duration: Duration;
  durationType: DurationType;
  sleepData: UserSleepData | null;
}

function determineScore(sleepData: UserSleepData, duration: Duration) {
  const data = getIntervalDataPointsWithinDuration(
    sleepData,
    duration,
    'score',
  );
  if (!data.length) {
    return null;
  }
  return data;
}

function getProgressChartData(scores: [string, number][]) {
  return {
    data: [scores[0][1] / 100],
  };
}

function getLabelsFromDuration(duration: Duration): string[] {
  let labels: string[] = [];
  const iterator = getMomentIteratorFromDuration(duration);
  for (const mmnt of iterator) {
    labels.push(mmnt.format('dd'));
  }
  return labels;
}

function getDataFromScores(
  scores: [string, number][],
  duration: Duration,
): number[] {
  let data: number[] = [];
  const iterator = getMomentIteratorFromDuration(duration);
  for (const mmnt of iterator) {
    const score = scores.find(([ts]) => mmnt.isSame(moment(ts), 'date'));
    data.push(score ? score[1] : 0);
  }
  return data;
}

function getBarChartData(scores: [string, number][], duration: Duration) {
  const labels = getLabelsFromDuration(duration);
  const data = getDataFromScores(scores, duration);
  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
}

const SleepScore = ({duration, durationType, sleepData}: SleepScoreProps) => {
  const scores = sleepData ? determineScore(sleepData, duration) : null;
  if (scores === null) {
    return <NoData />;
  }
  if (durationType === DurationType.DAY) {
    return <ProgressChart data={getProgressChartData(scores)} />;
  }
  if (durationType === DurationType.WEEK) {
    return (
      <BarChart
        data={getBarChartData(scores, duration)}
        yAxisLabel={''}
        yAxisSuffix={''}
      />
    );
  }
  return <Text variant="bodyMedium">{JSON.stringify(scores)}</Text>;
};

export default SleepScore;
