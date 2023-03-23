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

  const {
    fetchUsers,
    user: {users},
  } = use(appState$);

  useEffect(() => {
    // initialize app
    fetchUsers();
  }, [fetchUsers]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundColor}
        />
        {users.length ? <SleepReportScreen /> : <SplashScreen />}
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
