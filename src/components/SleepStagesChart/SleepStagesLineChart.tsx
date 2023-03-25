import React from 'react';
import {curveStepBefore} from 'd3';
import {StageEnum} from '../../api';
import {Theme, useTheme} from '../../theme';
import LineChart, {
  DataPoint,
  Scales,
  drawXLabels,
  drawYLabels,
} from '../LineChart';
import {SleepStagesChartData} from './types';

export interface SleepStagesLineChartProps {
  data: SleepStagesChartData;
}

const stageEnumMap = {
  [StageEnum.OUT]: 4,
  [StageEnum.AWAKE]: 3,
  [StageEnum.LIGHT]: 2,
  [StageEnum.DEEP]: 1,
};

const mapStageToNumber = (stage: StageEnum): number => {
  const value = stageEnumMap[stage];
  if (value === undefined) {
    throw new Error(`Unknown stage ${stage}`);
  }
  return value;
};

const mapNumberToStageLabel = (n: number): string | null => {
  const value = (
    Object.keys(stageEnumMap) as Array<keyof typeof stageEnumMap>
  ).find(enumVal => stageEnumMap[enumVal] === n);
  return value ?? null;
};

const getLineChartData = (data: SleepStagesChartData): DataPoint[] => {
  const [ts, stages] = data[0];
  let nextTimeMs = new Date(ts).getTime();
  return stages.map(value => {
    const dataPoint = {
      ts: nextTimeMs,
      value: mapStageToNumber(value.stage),
    };
    nextTimeMs += value.duration * 1000;
    return dataPoint;
  });
};

const drawLineMarkers = (
  scales: Scales,
  colors: Theme['colors'],
): JSX.Element[] => {
  const xLabels = drawXLabels(scales, colors.onBackground, undefined, 4);
  const yLabels = drawYLabels(
    scales,
    colors.onBackground,
    mapNumberToStageLabel,
    4,
  );
  return [...xLabels, ...yLabels];
};

const SleepStagesLineChart = ({data}: SleepStagesLineChartProps) => {
  const {colors} = useTheme();
  const lineData = getLineChartData(data);
  return (
    <LineChart
      data={[lineData]}
      drawExtras={scales => drawLineMarkers(scales, colors)}
      curveFactory={curveStepBefore}
    />
  );
};

export default SleepStagesLineChart;
