import React from 'react';
import moment from 'moment';
import {TimeSeries} from '../api';
import {Theme, useTheme} from '../theme';
import LineChart, {DataPoint, Scales} from './LineChart';
import {drawLegend, drawXLabels, drawYLabels} from './LineChart/renderUtils';
import NoData from './NoData';

export interface TemperatureChartProps {
  data: [string, TimeSeries][];
}

type ChartData = {data: DataPoint[]; color: string; label: string}[];

const determineAverage = (group: DataPoint[]): number => {
  const sum = group.reduce((curr, next) => {
    return curr + next.value;
  }, 0);
  return Math.floor(sum / group.length);
};

const determineChartData = (
  data: [string, TimeSeries][],
  colors: Theme['colors'],
): ChartData => {
  const room: DataPoint[] = [];
  const bed: DataPoint[] = [];
  function extractData(
    tSeries: TimeSeries,
    groupManipulator?: (g: DataPoint[]) => DataPoint[],
  ) {
    const bedGroup = tSeries.tempBedC.map(d => ({
      ts: new Date(d[0]).getTime(),
      value: d[1],
    }));
    bed.push(...(groupManipulator ? groupManipulator(bedGroup) : bedGroup));
    const roomGroup = tSeries.tempRoomC.map(d => ({
      ts: new Date(d[0]).getTime(),
      value: d[1],
    }));
    room.push(...(groupManipulator ? groupManipulator(roomGroup) : roomGroup));
  }
  if (data.length === 1) {
    // one day, full granularity
    extractData(data[0][1]);
  } else {
    // multiple days, daily averages
    for (const d of data) {
      extractData(d[1], group => [
        {
          ts: new Date(d[0]).getTime(),
          value: determineAverage(group),
        },
      ]);
    }
  }
  const result: ChartData = [];
  if (bed.length) {
    result.push({data: bed, color: colors.primary, label: 'Bed'});
  }
  if (room.length) {
    result.push({data: room, color: colors.secondary, label: 'Room'});
  }
  return result;
};

const getGetXLabel = (days: number) => (val: Date) =>
  moment(val).format(days > 1 ? 'dd' : 'hha');
// TODO use RNLocalize to determine whether to show C or F and convert when necessary
const getYLabel = (val: number) => `${val}ºC`;

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
      drawExtras={scales => drawExtras(scales, chartData, data.length)}
    />
  );
};

export default TemperatureChart;
