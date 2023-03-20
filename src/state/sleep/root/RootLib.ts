import {createStatedLib} from '@stated-library/base';
import {SleepDataNotFoundError} from '../../../api/sleepData';
import SleepDataClientWrapper from '../../../api/sleepData/SleepDataClientWrapper';
import {
  getMaxDate,
  getMinDate,
  getNowAsISO8601,
  shouldFetchUserSleepData,
} from './helpers';
import {RootLibActions, RootLibState} from './types';

export const DEFAULT_STATE: RootLibState = {
  requestError: null,
  userSleepData: {},
  selectedUserUuid: null,
  isFetching: false,
  _fetchPromise: null,
};

const createRootLib = () =>
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
              _fetchPromise: new Promise(async resolve => {
                await fetchPromise;
                resolve();
              }),
            },
            RootLibActions.FETCH_USER_SLEEP_DATA_START,
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
            RootLibActions.FETCH_USER_SLEEP_DATA_SUCCESS,
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
              RootLibActions.FETCH_USER_SLEEP_DATA_SUCCESS,
            );
          } else {
            const error = e instanceof Error ? e : new Error(JSON.stringify(e));
            updateState(
              {requestError: error},
              RootLibActions.FETCH_USER_SLEEP_DATA_FAILURE,
            );
          }
        } finally {
          updateState(
            {isFetching: false, _fetchPromise: null},
            RootLibActions.FETCH_USER_SLEEP_DATA_COMPLETE,
          );
        }
      },
      selectUser(uuid: string) {
        updateState(
          state => ({
            ...state,
            selectedUserUuid: uuid,
          }),
          RootLibActions.SELECT_USER,
        );
        // @ts-ignore - base is typed incorrectly
        if (shouldFetchUserSleepData(base.state, uuid)) {
          this.fetchUserSleepData(uuid);
        }
      },
    };
  });

export default createRootLib;
