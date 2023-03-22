import {selectSleepData, SleepLibState} from './sleep';
import {selectSelectedUserUuid, UserLibState} from './users';

export const getUserSleepDataByUserId = (
  sleepState: SleepLibState,
  userUuid: string,
) => {
  const sleepData = selectSleepData(sleepState);
  return sleepData[userUuid] ?? null;
};

export const getUserSleepData = (
  sleepState: SleepLibState,
  userState: UserLibState,
) => {
  const userUuid = selectSelectedUserUuid(userState);
  if (!userUuid) {
    return null;
  }
  return getUserSleepDataByUserId(sleepState, userUuid);
};
