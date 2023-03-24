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

export interface TemperatureChartProps {
  data: [string, TimeSeries][];
}

type ChartData = {data: DataPoint[]; color: string; label: string}[];

const determineChartData = (
  data: [string, TimeSeries][],
  colors: Theme['colors'],
): ChartData => {
  const dataMap = determineChartDataFromTimeSeries(data, [
    'tempBedC',
    'tempRoomC',
  ]);
  const result: ChartData = [];
  const bed = dataMap.get('tempBedC');
  if (bed?.length) {
    result.push({data: bed, color: colors.primary, label: 'Bed'});
  }
  const room = dataMap.get('tempRoomC');
  if (room?.length) {
    result.push({data: room, color: colors.secondary, label: 'Room'});
  }
  return result;
};

const getGetXLabel = (days: number) => (val: Date) =>
  moment(val).format(days > 1 ? 'dd' : 'hha');
// TODO use RNLocalize to determine whether to show C or F and convert when necessary
const getYLabel = (val: number) => `${val}ºC`;

const drawExtras = (
  scales: Scales,
  chartData: ChartData,
  colors: Theme['colors'],
  days: number,
) => {
  const rules = [
    ...drawXLabels(scales, colors.onBackground, getGetXLabel(days), 4),
    ...drawYLabels(scales, colors.onBackground, getYLabel, 4),
    ...drawLegend(
      scales,
      chartData.map(d => ({color: d.color, label: d.label})),
    ),
  ];
  return rules;
};

const TemperatureChart = ({data}: TemperatureChartProps) => {
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
      drawExtras={scales => drawExtras(scales, chartData, colors, data.length)}
    />
  );
};

export default TemperatureChart;
