import React, {useEffect} from 'react';
import {use} from '@stated-library/react';
import appState$ from '../state';
import SleepReportScreen from './SleepReportScreen';
import SplashScreen from './SplashScreen';

const AppRoot = () => {
  const {
    fetchUsers,
    user: {users, requestError},
  } = use(appState$);

  useEffect(() => {
    // initialize app
    fetchUsers();
  }, [fetchUsers]);

  if (requestError) {
    throw requestError;
  }

  return <>{users.length ? <SleepReportScreen /> : <SplashScreen />}</>;
};

export default AppRoot;
