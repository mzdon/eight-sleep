import {
  SleepDataBadRequestError,
  SleepDataConflictError,
  SleepDataForbiddenError,
  SleepDataInternalServerError,
  SleepDataNotFoundError,
  SleepDataServiceUnavailableError,
  SleepDataUnauthorizedError,
  SleepDataUnprocessableEntityError,
} from '../errors';
import SleepDataClient from '../SleepDataClient';

const mockGet = jest.fn();
jest.mock('../../shared/Client', () => {
  class MockClient {
    get: () => Promise<any>;
    constructor() {
      this.get = mockGet;
    }
  }
  return MockClient;
});

describe('SleepDataClient', () => {
  let sleepDataClient: SleepDataClient;
  beforeEach(() => {
    sleepDataClient = new SleepDataClient({});
  });

  describe('#fetchUserData', () => {
    describe('when the request is successful', () => {
      beforeEach(() => {
        mockGet.mockResolvedValue({data: {intervals: []}});
      });

      it('should return UserSleepData', async () => {
        const response = await sleepDataClient.fetchUserData('uuid');
        expect(response.intervals).toBeDefined();
      });
    });

    describe.each([
      [400, SleepDataBadRequestError],
      [401, SleepDataUnauthorizedError],
      [403, SleepDataForbiddenError],
      [404, SleepDataNotFoundError],
      [409, SleepDataConflictError],
      [422, SleepDataUnprocessableEntityError],
      [500, SleepDataInternalServerError],
      [503, SleepDataServiceUnavailableError],
    ])('when the request fails with known status code %s', (status, Error) => {
      beforeEach(() => {
        mockGet.mockRejectedValue({response: {status}});
      });

      it(`should throw a ${Error.name} error`, async () => {
        let error;
        try {
          await sleepDataClient.fetchUserData('uuid');
        } catch (e) {
          error = e;
        }
        expect(error).toBeInstanceOf(Error);
      });
    });

    describe('when the request fails with some unknown error', () => {
      beforeEach(() => {
        mockGet.mockRejectedValue('🔥');
      });

      it('should throw a SleepDataInternalServerError error', async () => {
        let error;
        try {
          await sleepDataClient.fetchUserData('uuid');
        } catch (e) {
          error = e;
        }
        expect(error).toBeInstanceOf(SleepDataInternalServerError);
      });
    });
  });
});
