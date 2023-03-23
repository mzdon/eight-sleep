import React from 'react';
import {IconButton} from 'react-native-paper';

export interface NextDurationButtonProps {
  onPress: (() => void) | null;
}

const NextDurationButton = ({onPress}: NextDurationButtonProps) => (
  <IconButton
    icon={'chevron-right'}
    onPress={onPress ?? undefined}
    disabled={!onPress}
  />
);

export default NextDurationButton;
