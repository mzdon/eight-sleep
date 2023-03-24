import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

export interface PreviousDurationButtonProps {
  onPress: (() => void) | null;
}

const style = StyleSheet.create({
  iconButton: {height: '100%'},
});

const PreviousDurationButton = ({onPress}: PreviousDurationButtonProps) => (
  <IconButton
    icon={'chevron-left'}
    onPress={onPress ?? undefined}
    disabled={!onPress}
    style={style.iconButton}
  />
);

export default PreviousDurationButton;
