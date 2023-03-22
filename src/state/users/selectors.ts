import {UserLibState} from './types';

export const selectSelectedUserUuid = (state: UserLibState) =>
  state.selectedUserUuid;
