import {Subscription} from '@stated-library/interface';
import {AppState} from '../types';
import {getAppState} from '..';
import userLib from '../users';
import sleepLib, {ONE_HOUR_MS} from '../sleep';

const mockFetchUserData = jest.fn().mockResolvedValue({
  intervals: [{id: '1', ts: '2023-03-21T00:00:00.000Z'}],
});
jest.mock('../../api/sleepData/SleepDataClientWrapper', () => {
  class MockSleepDataClient {
    fetchUserData: () => Promise<any>;
    constructor() {
      this.fetchUserData = mockFetchUserData;
    }
  }
  return {
    __esModule: true,
    default: {
      getClient: () => new MockSleepDataClient(),
    },
  };
});

describe('AppState$', () => {
  let appStateSubscription: Subscription;
  let appState: AppState;
  beforeEach(() => {
    const appState$ = getAppState();
    appStateSubscription = appState$.subscribe(next => {
      appState = next;
    });
  });

  afterEach(() => {
    appStateSubscription.unsubscribe();
  });

  it('should have an expected default state', () => {
    expect(appState.sleepData).toBe(null);
    expect(appState.selectUser).toBeInstanceOf(Function);
  });

  describe('#selectUser', () => {
    it('sets selectedUserUuid', () => {
      appState.selectUser('uuid');
      expect(userLib.state.selectedUserUuid).toBe('uuid');
    });

    describe('when the selected user data has never been fetched', () => {
      it('should fetch it', () => {
        appState.selectUser('uuid');
        expect(mockFetchUserData).toHaveBeenCalledWith('uuid');
      });
    });

    describe('when the selected user data has not been fetched within the last hour', () => {
      beforeEach(async () => {
        // fetch user data and await resolution
        sleepLib.fetchUserSleepData('uuid');
        await sleepLib.state._fetchPromise;
        // advance system time by at least an hour
        jest.useFakeTimers();
        jest.setSystemTime(Date.now() + ONE_HOUR_MS + 100);
        mockFetchUserData.mockClear();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should fetch it', () => {
        appState.selectUser('uuid');
        expect(mockFetchUserData).toHaveBeenCalledWith('uuid');
      });
    });

    describe('when the selected user data has been fetched within the last hour', () => {
      beforeEach(() => {
        appState.selectUser('uuid');
        mockFetchUserData.mockClear();
      });

      it('should not fetch it', () => {
        appState.selectUser('uuid');
        expect(mockFetchUserData).not.toHaveBeenCalled();
      });
    });
  });
});
