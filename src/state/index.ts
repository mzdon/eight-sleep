import {mapState} from '@stated-library/core';
import {getUserSleepData} from './getters';
import sleepLib, {shouldFetchUserSleepData} from './sleep';
import {AppState} from './types';
import userLib from './users';

export const getAppState = () =>
  mapState([sleepLib.state$, userLib.state$], ([sleepState, userState]) => {
    // action exposed to the UI
    const selectUser = (userUuid: string): void => {
      // set select user id
      userLib.selectUser(userUuid);
      // refetch user data if necessary
      if (shouldFetchUserSleepData(sleepState, userUuid)) {
        sleepLib.fetchUserSleepData(userUuid);
      }
    };
    return {
      sleepData: getUserSleepData(sleepState, userState),
      selectUser,
    } as AppState;
  });

export default getAppState();
