import React from 'react';
import {G, Text} from 'react-native-svg';
import {PADDING, useTheme} from '../../theme';

import {Scales, TooltipData} from './types';
import VerticalRule from './VerticalRule';

export interface TooltipProps {
  dataPoints: TooltipData[] | null;
  scales: Scales;
}

const TooltipText = ({
  x,
  y,
  color,
  children,
}: {
  x: number;
  y: number;
  color: string;
  children: string;
}) => {
  return (
    <Text
      x={x + PADDING * 0.5}
      y={y - PADDING * 0.5}
      stroke={color}
      fontWeight={1}
      fontSize={12}>
      {children}
    </Text>
  );
};

const Tooltip = ({dataPoints, scales}: TooltipProps) => {
  const {colors} = useTheme();
  if (!dataPoints) {
    return null;
  }
  return (
    <G>
      {dataPoints.map(({data, color, format}) => {
        let string = String(data.value);
        if (format) {
          string = format(data.value) || string;
        }
        return (
          <TooltipText
            x={scales.x(data.ts)}
            y={scales.y(data.value)}
            color={color}>
            {string}
          </TooltipText>
        );
      })}
      <VerticalRule
        height={scales.height}
        x={scales.x(dataPoints[0].data.ts)}
        color={colors.tertiary}
        opacity={1}
      />
    </G>
  );
};

export default Tooltip;
