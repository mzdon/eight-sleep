import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {UserSleepData} from '../../state/sleep';
import {Duration} from '../../utils';
import {
  selectNextDurationAction,
  selectPreviousDurationAction,
} from './reducer';

export const useSelectNextDuration = (
  selectedDuration: Duration,
  sleepData: UserSleepData | null,
  dispatch: Dispatch<any>,
): (() => void) | null => {
  const selectNextDuration = useCallback(() => {
    dispatch(selectNextDurationAction());
  }, [dispatch]);
  if (!sleepData) {
    return null;
  }
  const upperBound = moment(selectedDuration[1]);
  const hasNextDuration = sleepData.intervals.find(({ts}) =>
    moment(ts).isAfter(upperBound),
  );
  if (!hasNextDuration) {
    return null;
  }
  return selectNextDuration;
};

export const useSelectPreviousDuration = (
  selectedDuration: Duration,
  sleepData: UserSleepData | null,
  dispatch: Dispatch<any>,
): (() => void) | null => {
  const selectPreviousDuration = useCallback(() => {
    dispatch(selectPreviousDurationAction());
  }, [dispatch]);
  if (!sleepData) {
    return null;
  }
  const lowerBound = moment(selectedDuration[0]);
  const hasPreviousDuration = sleepData.intervals.find(({ts}) =>
    moment(ts).isBefore(lowerBound),
  );
  if (!hasPreviousDuration) {
    return null;
  }
  return selectPreviousDuration;
};
