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
  return {
    ...actual,
    use: () => ({fetchUsers: jest.fn(), sleepData: null}),
  };
});

it('renders correctly', () => {
  renderer.create(<App />);
});
