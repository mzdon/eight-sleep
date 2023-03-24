import React from 'react';
import {Text} from 'react-native-paper';
import {Duration, DurationType} from '../../utils';
import NoData from '../NoData';
import SleepStagesPieChart from './SleepStagesPieChart';
import {SleepStagesChartData} from './types';
import SleepStagesLineChart from './SleepStagesLineChart';

export interface SleepStagesChartProps {
  data: SleepStagesChartData;
  duration: Duration;
  durationType: DurationType;
}

const SleepStagesChart = ({data, durationType}: SleepStagesChartProps) => {
  if (!data.length) {
    return <NoData />;
  }
  if (durationType === DurationType.DAY) {
    return <SleepStagesLineChart data={data} />;
  }
  if (durationType === DurationType.WEEK) {
    return <SleepStagesPieChart data={data} />;
  }
  return <Text variant="bodyMedium">{JSON.stringify(data)}</Text>;
};

export default SleepStagesChart;
