import {selectSleepData, SleepLibState} from './sleep';
import {selectSelectedUserId, UserLibState} from './users';

export const getUserSleepDataByUserId = (
  sleepState: SleepLibState,
  userId: string,
) => {
  const sleepData = selectSleepData(sleepState);
  return sleepData[userId] ?? null;
};

export const getUserSleepData = (
  sleepState: SleepLibState,
  userState: UserLibState,
) => {
  const userId = selectSelectedUserId(userState);
  if (!userId) {
    return null;
  }
  return getUserSleepDataByUserId(sleepState, userId);
};
