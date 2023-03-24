import React, {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PADDING} from '../theme';
import Spacer from './Spacer';

export type ErrorBoundaryProps = PropsWithChildren<{}>;

export interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

const styles = StyleSheet.create({
  safeAreaView: {flex: 1},
  surface: {
    minHeight: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    padding: PADDING,
  },
  text: {
    textAlign: 'center',
  },
});

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, message: ''};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, message: error.message};
  }

  componentDidCatch() {
    // TODO: report errors to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.safeAreaView}>
          <Surface style={styles.surface}>
            <Text variant="headlineLarge" style={styles.text}>
              Oh crumbs! Something unexpected happened!
            </Text>
            <Spacer />
            <Text variant="displayLarge" style={styles.text}>
              :_(
            </Text>
            <Spacer />
            <Text variant="bodyLarge" style={styles.text}>
              {this.state.message}
            </Text>
          </Surface>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
