import React from 'react';
import {Snackbar, SnackbarProps} from 'react-native-paper';

export type ErrorSnackProps = {
  message: string | null;
} & Omit<SnackbarProps, 'visible' | 'children'>;

const ErrorSnack = ({message, onDismiss, action}: ErrorSnackProps) => {
  return (
    <Snackbar visible={!!message} onDismiss={onDismiss} action={action}>
      {message}
    </Snackbar>
  );
};

export default ErrorSnack;
