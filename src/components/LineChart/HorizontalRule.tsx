import React from 'react';
import {Line} from 'react-native-svg';
import {PADDING, useTheme} from '../../theme';

interface HorizontalRuleProps {
  height: number;
  width: number;
}

const HorizontalRule = ({height, width}: HorizontalRuleProps) => {
  const {colors} = useTheme();
  return (
    <Line
      x1={PADDING}
      y1={height}
      x2={width}
      y2={height}
      stroke={colors.onBackground}
      opacity={0.3}
      strokeWidth="1"
      strokeDasharray={[8, 12]}
    />
  );
};

export default HorizontalRule;
