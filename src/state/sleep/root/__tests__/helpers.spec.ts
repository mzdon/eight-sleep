import {ONE_HOUR_MS} from '../constants';
import {shouldFetchUserSleepData} from '../helpers';
import {RootLibState} from '../types';

const anyRootLibState = (o: unknown) => {
  return o as RootLibState;
};

describe('RootLib helpers', () => {
  describe('#shouldFetchUserSleepData', () => {
    describe('when there is no sleep data for the specified uuid', () => {
      it('should return true', () => {
        expect(
          shouldFetchUserSleepData(
            anyRootLibState({userSleepData: {}}),
            'uuid',
          ),
        ).toBe(true);
      });
    });

    describe('when the sleep data for the specified uuid had been fetched within the last hour', () => {
      it('should return false', () => {
        expect(
          shouldFetchUserSleepData(
            anyRootLibState({
              userSleepData: {
                ['uuid']: {
                  lastFetch: new Date().toISOString(),
                },
              },
            }),
            'uuid',
          ),
        ).toBe(false);
      });
    });

    describe('when the sleep data for the specified uuid had been fetched over an hour ago', () => {
      it('should return true', () => {
        expect(
          shouldFetchUserSleepData(
            anyRootLibState({
              userSleepData: {
                ['uuid']: {
                  lastFetch: new Date(
                    new Date().getTime() - ONE_HOUR_MS - 100,
                  ).toISOString(),
                },
              },
            }),
            'uuid',
          ),
        ).toBe(true);
      });
    });
  });
});
