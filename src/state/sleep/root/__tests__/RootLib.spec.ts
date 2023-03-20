import {ONE_HOUR_MS} from '../constants';
import createRootLib, {DEFAULT_STATE} from '../RootLib';

const mockFetchUserData = jest.fn().mockResolvedValue({intervals: []});
jest.mock('../../../../api/sleepData/SleepDataClientWrapper', () => {
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

describe('RootLib', () => {
  let rootLib: ReturnType<typeof createRootLib>;
  beforeEach(() => {
    rootLib = createRootLib();
  });

  it('should have an expected default state', () => {
    expect(rootLib.state).toEqual(DEFAULT_STATE);
  });

  describe('#selectUser', () => {
    it('sets selectedUserUuid', () => {
      rootLib.selectUser('uuid');
      expect(rootLib.state.selectedUserUuid).toBe('uuid');
    });

    describe('when the selected user data has never been fetched', () => {
      it('should fetch it', () => {
        rootLib.selectUser('uuid');
        expect(mockFetchUserData).toHaveBeenCalledWith('uuid');
      });
    });

    describe('when the selected user data has not been fetched within the last hour', () => {
      beforeEach(async () => {
        // fetch user data and await resolution
        rootLib.fetchUserSleepData('uuid');
        await rootLib.state._fetchPromise;
        // advance system time by at least an hour
        jest.useFakeTimers();
        jest.setSystemTime(Date.now() + ONE_HOUR_MS + 100);
        mockFetchUserData.mockClear();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should fetch it', () => {
        rootLib.selectUser('uuid');
        expect(mockFetchUserData).toHaveBeenCalledWith('uuid');
      });
    });

    describe('when the selected user data has been fetched within the last hour', () => {
      beforeEach(() => {
        rootLib.selectUser('uuid');
        mockFetchUserData.mockClear();
      });

      it('should not fetch it', () => {
        rootLib.selectUser('uuid');
        expect(mockFetchUserData).not.toHaveBeenCalled();
      });
    });
  });
});
