import React from 'react';
import {G, Text} from 'react-native-svg';
import moment from 'moment';
import {StageEnum} from '../../api';
import {Theme, useTheme} from '../../theme';
import LineChart, {
  DataPoint,
  HorizontalRule,
  Scales,
  VerticalRule,
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

const drawXLabels = (
  scales: Scales,
  colors: Theme['colors'],
): JSX.Element[] => {
  const xTicks = scales.x.ticks(4);
  const widths = xTicks.map(t => ({w: scales.x(t), val: t}));
  return widths.map(xs => {
    return (
      <G key={xs.val.toISOString()}>
        <Text
          x={xs.w}
          y={scales.height}
          stroke={colors.onBackground}
          fontWeight={1}>
          {moment(xs.val).format('hh a')}
        </Text>
        <VerticalRule height={scales.height} width={xs.w} />
      </G>
    );
  });
};

const drawYLabels = (
  scales: Scales,
  colors: Theme['colors'],
): JSX.Element[] => {
  const yTicks = scales.y.ticks(4);
  const heights = yTicks.map(t => ({h: scales.y(t), val: t}));
  return heights.map(ys => {
    const label = mapNumberToStageLabel(ys.val);
    if (!label) {
      // no corresponding label, nothing to show
      return <></>;
    }
    return (
      <G key={ys.val}>
        <Text x={0} y={ys.h} stroke={colors.onBackground} fontWeight={1}>
          {label}
        </Text>
        <HorizontalRule height={ys.h} width={scales.width} />
      </G>
    );
  });
};

const drawLineMarkers = (
  scales: Scales,
  colors: Theme['colors'],
): JSX.Element[] => {
  const xLabels = drawXLabels(scales, colors);
  const yLabels = drawYLabels(scales, colors);
  return [...xLabels, ...yLabels];
};

const SleepStagesLineChart = ({data}: SleepStagesLineChartProps) => {
  const {colors} = useTheme();
  const lineData = getLineChartData(data);
  return (
    <LineChart
      data={lineData}
      drawExtras={scales => drawLineMarkers(scales, colors)}
    />
  );
};

export default SleepStagesLineChart;
