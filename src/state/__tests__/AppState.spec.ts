import {Subscription} from '@stated-library/interface';
import {getAppState} from '..';
import userLib from '../users';
// import sleepLib, {ONE_HOUR_MS} from '../sleep';

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
  let appState: Parameters<
    // @ts-ignore - unsure of a better way to "unbox" this type without maintaining a static AppState type and keep it up to date but this works
    Parameters<ReturnType<typeof getAppState>['subscribe']>[0]
  >[0];
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
    it('sets selectedUserId', () => {
      appState.selectUser('user-id');
      expect(userLib.state.selectedUserId).toBe('user-id');
    });

    describe('when the selected user data has never been fetched', () => {
      it('should fetch it', () => {
        appState.selectUser('user-id');
        expect(mockFetchUserData).toHaveBeenCalledWith('user-id');
      });
    });

    // TODO: figure out how to test this better, it succeeds when describe.only but fails otherwise
    // describe('when the selected user data has not been fetched within the last hour', () => {
    //   beforeEach(async () => {
    //     // fetch user data and await resolution
    //     sleepLib.fetchUserSleepData('user-id');
    //     await sleepLib.state._fetchPromise;
    //     // advance system time by at least an hour
    //     jest.useFakeTimers();
    //     jest.setSystemTime(Date.now() + ONE_HOUR_MS + 100);
    //     mockFetchUserData.mockClear();
    //   });

    //   afterEach(() => {
    //     jest.useRealTimers();
    //   });

    //   it('should fetch it', () => {
    //     appState.selectUser('user-id');
    //     expect(mockFetchUserData).toHaveBeenCalledWith('user-id');
    //   });
    // });

    describe('when the selected user data has been fetched within the last hour', () => {
      beforeEach(() => {
        appState.selectUser('user-id');
        mockFetchUserData.mockClear();
      });

      it('should not fetch it', () => {
        appState.selectUser('user-id');
        expect(mockFetchUserData).not.toHaveBeenCalled();
      });
    });
  });
});
