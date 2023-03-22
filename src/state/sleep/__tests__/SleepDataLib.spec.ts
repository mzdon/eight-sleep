import {
  SleepDataInternalServerError,
  SleepDataNotFoundError,
} from '../../../api/sleepData';
import createSleepLib, {DEFAULT_STATE} from '../SleepLib';

const mockFetchUserData = jest.fn().mockResolvedValue({
  intervals: [{id: '1', ts: '2023-03-21T00:00:00.000Z'}],
});
jest.mock('../../../api/sleepData/SleepDataClientWrapper', () => {
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

describe('SleepLib', () => {
  let sleepLib: ReturnType<typeof createSleepLib>;
  beforeEach(() => {
    sleepLib = createSleepLib();
  });

  it('should have an expected default state', () => {
    expect(sleepLib.state).toEqual(DEFAULT_STATE);
  });

  describe('#fetchUserSleepData', () => {
    it('should fetch user sleep data', async () => {
      sleepLib.fetchUserSleepData('user-uuid');
      await sleepLib.state._fetchPromise;
      expect(sleepLib.state.userSleepData['user-uuid']).toEqual({
        intervals: [{id: '1', ts: '2023-03-21T00:00:00.000Z'}],
        minDate: '2023-03-21T00:00:00.000Z',
        maxDate: '2023-03-21T00:00:00.000Z',
        lastFetch: expect.stringContaining('T'),
      });
    });

    describe('when the request fails with a 404', () => {
      beforeEach(() => {
        mockFetchUserData.mockRejectedValueOnce(new SleepDataNotFoundError());
      });

      it('should complete the transaction successfully and set an empty array for that uuid sleep data', async () => {
        sleepLib.fetchUserSleepData('other-user-uuid');
        await sleepLib.state._fetchPromise;
        expect(sleepLib.state.userSleepData['other-user-uuid']).toEqual({
          intervals: [],
          minDate: null,
          maxDate: null,
          lastFetch: expect.stringContaining('T'),
        });
      });
    });

    describe('when the request fails with any other error', () => {
      beforeEach(() => {
        mockFetchUserData.mockRejectedValueOnce(
          new SleepDataInternalServerError(),
        );
      });
      it('should set the requestError', async () => {
        sleepLib.fetchUserSleepData('another-uuid');
        await sleepLib.state._fetchPromise;
        expect(sleepLib.state.requestError).toBeInstanceOf(
          SleepDataInternalServerError,
        );
      });
    });

    describe('when a previous request failed', () => {
      beforeEach(async () => {
        mockFetchUserData.mockRejectedValueOnce(
          new SleepDataInternalServerError(),
        );
        sleepLib.fetchUserSleepData('failed-uuid');
        await sleepLib.state._fetchPromise;
      });

      it('should clear requestError on a successful request', async () => {
        expect(sleepLib.state.requestError).toBeInstanceOf(
          SleepDataInternalServerError,
        );
        expect(sleepLib.state.userSleepData['failed-uuid']).toBeUndefined();
        sleepLib.fetchUserSleepData('failed-uuid');
        await sleepLib.state._fetchPromise;
        expect(sleepLib.state.requestError).toBe(null);
        expect(sleepLib.state.userSleepData['failed-uuid']).toBeDefined();
      });
    });
  });
});
