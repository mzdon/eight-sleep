import React from 'react';
import {Line} from 'react-native-svg';
import {useTheme} from '../../theme';

interface VerticalRuleProps {
  height: number;
  x: number;
  color?: string;
  opacity?: number;
}

const VerticalRule = ({height, x, color, opacity}: VerticalRuleProps) => {
  const {colors} = useTheme();
  return (
    <Line
      x1={x}
      y1={0}
      x2={x}
      y2={height}
      stroke={color ?? colors.onBackground}
      opacity={opacity ?? 0.3}
      strokeWidth="1"
      strokeDasharray={[8, 12]}
    />
  );
};

export default VerticalRule;
