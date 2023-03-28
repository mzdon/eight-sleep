/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';

import {useTheme} from './theme';
import {AppRoot} from './screens';
import {ErrorBoundary} from './components';

function App(): JSX.Element {
  const theme = useTheme();
  const {
    dark: isDarkMode,
    colors: {background: backgroundColor},
  } = theme;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundColor}
        />
        <ErrorBoundary>
          <AppRoot />
        </ErrorBoundary>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
