import React from 'react';
import {IconButton} from 'react-native-paper';

export interface PreviousDurationButtonProps {
  onPress: (() => void) | null;
}

const PreviousDurationButton = ({onPress}: PreviousDurationButtonProps) => (
  <IconButton
    icon={'chevron-left'}
    onPress={onPress ?? undefined}
    disabled={!onPress}
  />
);

export default PreviousDurationButton;
