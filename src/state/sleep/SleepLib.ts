import {createStatedLib} from '@stated-library/base';
import {
  SleepDataClientWrapper,
  SleepDataNotFoundError,
} from '../../api/sleepData';
import {getMaxDate, getMinDate, getNowAsISO8601} from './helpers';
import {SleepLibActions, SleepLibState} from './types';

export const DEFAULT_STATE: SleepLibState = {
  requestError: null,
  userSleepData: {},
  isFetching: false,
  _fetchPromise: null,
};

const createSleepLib = () =>
  createStatedLib(DEFAULT_STATE, base => {
    const {updateState} = base;
    return {
      async fetchUserSleepData(uuid: string) {
        try {
          const fetchPromise =
            SleepDataClientWrapper.getClient().fetchUserData(uuid);
          updateState(
            {
              isFetching: true,
              // encapsulate fetchPromise to avoid data access outside the root lib state
              _fetchPromise: new Promise(resolve => {
                fetchPromise.catch(() => undefined).finally(() => resolve());
              }),
              requestError: null,
            },
            SleepLibActions.FETCH_USER_SLEEP_DATA_START,
          );
          const data = await fetchPromise;
          // it seems sorting shouldn't be a concern, otherwise I'd likely do it here
          updateState(
            state => ({
              ...state,
              userSleepData: {
                ...state.userSleepData,
                [uuid]: {
                  ...data,
                  minDate: getMinDate(data.intervals),
                  maxDate: getMaxDate(data.intervals),
                  lastFetch: getNowAsISO8601(),
                },
              },
            }),
            SleepLibActions.FETCH_USER_SLEEP_DATA_SUCCESS,
          );
        } catch (e) {
          if (e instanceof SleepDataNotFoundError) {
            updateState(
              state => ({
                ...state,
                userSleepData: {
                  ...state.userSleepData,
                  [uuid]: {
                    intervals: [],
                    maxDate: null,
                    minDate: null,
                    lastFetch: getNowAsISO8601(),
                  },
                },
              }),
              SleepLibActions.FETCH_USER_SLEEP_DATA_SUCCESS,
            );
          } else {
            const error = e instanceof Error ? e : new Error(JSON.stringify(e));
            updateState(
              {requestError: error},
              SleepLibActions.FETCH_USER_SLEEP_DATA_FAILURE,
            );
          }
        } finally {
          updateState(
            {isFetching: false, _fetchPromise: null},
            SleepLibActions.FETCH_USER_SLEEP_DATA_COMPLETE,
          );
        }
      },
    };
  });

export default createSleepLib;
