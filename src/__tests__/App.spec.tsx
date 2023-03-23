/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@stated-library/react', () => {
  const actual = jest.requireActual('@stated-library/react');
  const {
    DEFAULT_STATE: DEFAULT_SLEEP_STATE,
  } = require('../state/sleep/SleepLib');
  const {DEFAULT_STATE: DEFAULT_USER_STATE} = require('../state/users/UserLib');
  return {
    ...actual,
    use: () => ({
      fetchUsers: jest.fn(),
      sleep: DEFAULT_SLEEP_STATE,
      user: DEFAULT_USER_STATE,
    }),
  };
});

it('renders correctly', () => {
  renderer.create(<App />);
});
