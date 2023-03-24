import React from 'react';
import moment from 'moment';
import {G, Text} from 'react-native-svg';
import HorizontalRule from './HorizontalRule';
import {Scales} from './LineChart';
import VerticalRule from './VerticalRule';
import {PADDING} from '../../theme';

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
        <Text x={xs.w} y={scales.height} stroke={color} fontWeight={1}>
          {getLabel ? getLabel(xs.val) : moment(xs.val).format('hh a')}
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
