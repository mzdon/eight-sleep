import React from 'react';
import moment from 'moment';
import {G, Text} from 'react-native-svg';
import HorizontalRule from './HorizontalRule';
import {DataPoint, Scales} from './LineChart';
import VerticalRule from './VerticalRule';
import {PADDING} from '../../theme';
import {TimeSeries} from '../../api';
import {determineDataPointAverage} from '../../utils';

export const drawLegend = (
  scales: Scales,
  specs: {color: string; label: string}[],
) => {
  return specs.map(({label, color}, i) => {
    const y = scales.height - (specs.length - i) * PADDING;
    return (
      <G key={`label-${i}`}>
        <Text x={0} y={y} stroke={color} fontWeight={1}>
          {label}
        </Text>
      </G>
    );
  });
};

export const drawXLabels = (
  scales: Scales,
  color: string,
  getLabel?: (val: Date) => string | null,
  ticks?: number,
): JSX.Element[] => {
  const xTicks = scales.x.ticks(ticks);
  const widths = xTicks.map(t => ({w: scales.x(t), val: t}));
  return widths.map(xs => {
    return (
      <G key={xs.val.toISOString()}>
        <Text
          x={xs.w - PADDING}
          y={scales.height}
          stroke={color}
          fontWeight={1}>
          {getLabel ? getLabel(xs.val) : moment(xs.val).format('hha')}
        </Text>
        <VerticalRule height={scales.height} width={xs.w} />
      </G>
    );
  });
};

export const drawYLabels = (
  scales: Scales,
  color: string,
  getLabel: (val: number) => string | null,
  ticks?: number,
): JSX.Element[] => {
  const yTicks = scales.y.ticks(ticks);
  const heights = yTicks.map(t => ({h: scales.y(t), val: t}));
  return heights.map(ys => {
    const label = getLabel(ys.val);
    if (!label) {
      // no corresponding label, nothing to show
      return <></>;
    }
    return (
      <G key={ys.val}>
        <Text x={0} y={ys.h} stroke={color} fontWeight={1}>
          {label}
        </Text>
        <HorizontalRule height={ys.h} width={scales.width} />
      </G>
    );
  });
};

export const determineChartDataFromTimeSeries = (
  data: [string, TimeSeries][],
  keys: (keyof TimeSeries)[],
): Map<keyof TimeSeries, DataPoint[]> => {
  const result = new Map<keyof TimeSeries, DataPoint[]>();

  function extractData(
    tSeries: TimeSeries,
    groupManipulator?: (g: DataPoint[]) => DataPoint[],
  ) {
    (keys as Array<keyof TimeSeries>).forEach(k => {
      const group = tSeries[k].map(d => ({
        ts: new Date(d[0]).getTime(),
        value: d[1],
      }));
      result.set(k, groupManipulator ? groupManipulator(group) : group);
    });
  }

  if (data.length === 1) {
    // one day, full granularity
    extractData(data[0][1]);
  } else {
    // multiple days, daily averages
    for (const d of data) {
      extractData(d[1], group => {
        const value = determineDataPointAverage(group);
        return [
          {
            ts: new Date(d[0]).getTime(),
            value: value ?? 0,
          },
        ];
      });
    }
  }

  return result;
};
