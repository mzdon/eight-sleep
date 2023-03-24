import React from 'react';
import {Line} from 'react-native-svg';
import {useTheme} from '../../theme';

interface VerticalRuleProps {
  height: number;
  width: number;
}

const VerticalRule = ({height, width}: VerticalRuleProps) => {
  const {colors} = useTheme();
  return (
    <Line
      x1={width}
      y1={0}
      x2={width}
      y2={height}
      stroke={colors.onBackground}
      opacity={0.3}
      strokeWidth="1"
      strokeDasharray={[8, 12]}
    />
  );
};

export default VerticalRule;
