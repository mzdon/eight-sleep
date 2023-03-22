import {UserLibState} from './types';

export const selectSelectedUserId = (state: UserLibState) =>
  state.selectedUserId;
