const mockSafeAreaContext =
  require('react-native-safe-area-context/jest/mock').default;

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const mock = jest.fn(() => null);
  return {
    ...actual,
    ActivityIndicator: mock,
  };
});
