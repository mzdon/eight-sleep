import {User} from '../../api';

export interface UserLibState {
  users: User[];
  selectedUserId: string | null;
  requestError: Error | null;
  isFetching: boolean;
  _fetchPromise: Promise<void> | null;
}

export enum UserLibActions {
  FETCH_USER_DATA_START = 'FETCH_USER_DATA_START',
  FETCH_USER_DATA_SUCCESS = 'FETCH_USER_DATA_SUCCESS',
  FETCH_USER_DATA_FAILURE = 'FETCH_USER_DATA_FAILURE',
  FETCH_USER_DATA_COMPLETE = 'FETCH_USER_DATA_COMPLETE',
  SELECT_USER = 'SELECT_USER',
}
