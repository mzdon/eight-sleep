/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import {use} from '@stated-library/react';

import appState$ from './state';
import {useTheme} from './theme';
import {SleepReportScreen, SplashScreen} from './screens';

function App(): JSX.Element {
  const theme = useTheme();
  const {
    dark: isDarkMode,
    colors: {background: backgroundColor},
  } = theme;

  const {sleepData, fetchUsers} = use(appState$);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundColor}
        />
        {sleepData ? <SleepReportScreen data={sleepData} /> : <SplashScreen />}
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
