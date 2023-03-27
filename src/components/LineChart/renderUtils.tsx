import React from 'react';
import moment from 'moment';
import {G, Text} from 'react-native-svg';
import HorizontalRule from './HorizontalRule';
import {DataPoint, Scales} from './types';
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
      <G key={`label-${i}-${label}`}>
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
  return scales.x.ticks(ticks).map((t, i) => {
    const tick = {x: scales.x(t), val: t};
    const label = getLabel
      ? getLabel(tick.val)
      : moment(tick.val).format('hha');
    return (
      <G key={`xTick-${i}-${tick.val.toISOString()}`}>
        <Text
          x={tick.x - PADDING}
          y={scales.height}
          stroke={color}
          fontWeight={1}>
          {label}
        </Text>
        <VerticalRule height={scales.height} x={tick.x} />
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
  return scales.y.ticks(ticks).map((t, i) => {
    const tick = {y: scales.y(t), val: t};
    const label = getLabel(tick.val);
    if (!label) {
      // no corresponding label, nothing to show
      return <G key={`yTick-${i}-${tick.val}`} />;
    }
    return (
      <G key={`yTick-${i}-${tick.val}`}>
        <Text x={0} y={tick.y} stroke={color} fontWeight={1}>
          {label}
        </Text>
        <HorizontalRule height={tick.y} width={scales.width} />
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
      const dataArr = result.get(k) || [];
      dataArr.push(...(groupManipulator ? groupManipulator(group) : group));
      result.set(k, dataArr);
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
