import React from 'react';
import moment from 'moment';
import {TimeSeries} from '../api';
import {Theme, useTheme} from '../theme';
import LineChart, {
  DataPoint,
  Scales,
  determineChartDataFromTimeSeries,
  drawLegend,
  drawXLabels,
  drawYLabels,
} from './LineChart';
import NoData from './NoData';

export interface HealthIndicatorsChartProps {
  data: [string, TimeSeries][];
}

type ChartData = {data: DataPoint[]; color: string; label: string}[];

const determineChartData = (
  data: [string, TimeSeries][],
  colors: Theme['colors'],
): ChartData => {
  const dataMap = determineChartDataFromTimeSeries(data, [
    'heartRate',
    'respiratoryRate',
  ]);
  const result: ChartData = [];
  const heart = dataMap.get('heartRate');
  if (heart?.length) {
    result.push({data: heart, color: colors.primary, label: 'Heart'});
  }
  const respiratory = dataMap.get('respiratoryRate');
  if (respiratory?.length) {
    result.push({
      data: respiratory,
      color: colors.secondary,
      label: 'Breathing',
    });
  }
  return result;
};

const getGetXLabel = (days: number) => (val: Date) =>
  moment(val).format(days > 1 ? 'dd' : 'hha');
// TODO use RNLocalize to determine whether to show C or F and convert when necessary
const getYLabel = (val: number) => `${val}bpm`;

const drawExtras = (scales: Scales, chartData: ChartData, days: number) => {
  const rules = [
    ...drawXLabels(scales, chartData[0].color, getGetXLabel(days), 4),
    ...drawYLabels(scales, chartData[0].color, getYLabel, 4),
    ...drawLegend(
      scales,
      chartData.map(d => ({color: d.color, label: d.label})),
    ),
  ];
  return rules;
};

const HealthIndicatorsChart = ({data}: HealthIndicatorsChartProps) => {
  const {colors} = useTheme();
  if (!data?.length) {
    return <NoData />;
  }
  const chartData = determineChartData(data, colors);
  if (!chartData.length) {
    return <NoData />;
  }
  return (
    <LineChart
      data={chartData.map(d => d.data)}
      colors={chartData.map(d => d.color)}
      drawExtras={scales => drawExtras(scales, chartData, data.length)}
    />
  );
};

export default HealthIndicatorsChart;
