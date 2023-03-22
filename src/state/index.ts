import {mapState} from '@stated-library/core';
import {distinctUntilKeyChanged} from 'rxjs';
import {getUserSleepData} from './getters';
import sleepLib from './sleep';
import userLib from './users';
import {from} from '../utils';

from(userLib.state$)
  .pipe(distinctUntilKeyChanged('selectedUserId'))
  .subscribe(({selectedUserId}) => {
    if (selectedUserId) {
      sleepLib.fetchUserSleepData(selectedUserId);
    }
  });

export const getAppState = () =>
  mapState([sleepLib.state$, userLib.state$], ([sleepState, userState]) => {
    return {
      sleepData: getUserSleepData(sleepState, userState),
      sleep: {
        ...sleepState,
      },
      user: {
        ...userState,
      },
      fetchUsers: userLib.fetchUsers,
      selectUser: userLib.selectUser,
    };
  });

export default getAppState();
