import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {SPACING} from '../theme';

interface SpacerPops {
  scale?: number;
  direction?: 'vertical' | 'horizontal';
}

function determineStyle(
  scale = 1,
  direction = 'vertical',
): StyleProp<ViewStyle> {
  if (direction === 'vertical') {
    return {
      height: scale * SPACING,
    };
  }
  return {
    width: scale * SPACING,
  };
}

const Spacer = ({scale, direction}: SpacerPops) => {
  const style = determineStyle(scale, direction);
  return <View style={style} />;
};

export default Spacer;
