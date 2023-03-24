import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

export interface NextDurationButtonProps {
  onPress: (() => void) | null;
}

const style = StyleSheet.create({
  iconButton: {height: '100%'},
});

const NextDurationButton = ({onPress}: NextDurationButtonProps) => (
  <IconButton
    icon={'chevron-right'}
    onPress={onPress ?? undefined}
    disabled={!onPress}
    style={style.iconButton}
  />
);

export default NextDurationButton;
