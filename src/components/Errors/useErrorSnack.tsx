import React, {useState, useEffect, useCallback} from 'react';
import ErrorSnack from './ErrorSnack';

export const useErrorSnack = (error: Error | null, prefix = '') => {
  const [message, setMessage] = useState(error?.message ?? null);
  useEffect(() => {
    setMessage(error?.message || null);
  }, [error]);
  const clearError = useCallback(() => setMessage(null), []);
  const fullMessage = message ? `${prefix} ${message}` : null;
  return () => (
    <ErrorSnack
      message={fullMessage}
      onDismiss={clearError}
      action={{label: 'Clear', onPress: clearError}}
    />
  );
};

const getUseNetworkErrorSnack = () => {
  const prefix = 'Request failed: ';
  return (error: Error | null) => useErrorSnack(error, prefix);
};

export const useNetworkErrorSnack = getUseNetworkErrorSnack();
