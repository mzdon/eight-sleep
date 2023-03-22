import {createStatedLib} from '@stated-library/base';
import {UserDataClientWrapper} from '../../api';
import {UserLibState, UserLibActions} from './types';

export const DEFAULT_STATE: UserLibState = {
  users: [],
  selectedUserUuid: null,
  requestError: null,
  isFetching: false,
  _fetchPromise: null,
};

const createUserLib = () =>
  createStatedLib(DEFAULT_STATE, base => {
    const {updateState} = base;
    return {
      async fetchUsers() {
        // TODO: look for an opportunity to refactor some of these common pieces of
        // stated libs with fetch functionality
        try {
          const fetchPromise = UserDataClientWrapper.getClient().fetchUsers();
          updateState(
            {
              isFetching: true,
              // encapsulate fetchPromise to avoid data access outside the lib state
              _fetchPromise: new Promise(async resolve => {
                await fetchPromise;
                resolve();
              }),
            },
            UserLibActions.FETCH_USER_DATA_START,
          );
          const data = await fetchPromise;
          updateState(
            state => ({
              ...state,
              users: data,
            }),
            UserLibActions.FETCH_USER_DATA_SUCCESS,
          );
        } catch (e) {
          const error = e instanceof Error ? e : new Error(JSON.stringify(e));
          updateState(
            {requestError: error},
            UserLibActions.FETCH_USER_DATA_FAILURE,
          );
        } finally {
          updateState(
            {isFetching: false, _fetchPromise: null},
            UserLibActions.FETCH_USER_DATA_COMPLETE,
          );
        }
      },
      selectUser(userUuid: string) {
        updateState(
          state => ({
            ...state,
            selectedUserUuid: userUuid,
          }),
          UserLibActions.SELECT_USER,
        );
      },
    };
  });

export default createUserLib;
