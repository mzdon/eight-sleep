import {createStatedLib} from '@stated-library/base';
import {DayDurationLibActions, DayDurationLibState} from './types';

export const DEFAULT_STATE: DayDurationLibState = {
  selectedInterval: null,
};

const createDayDurationLib = () =>
  createStatedLib(DEFAULT_STATE, base => {
    const {updateState} = base;
    return {
      selectInterval(intervalId: number) {
        updateState(
          {selectedInterval: intervalId},
          DayDurationLibActions.SELECT_INTERVAL,
        );
      },
    };
  });

export default createDayDurationLib;
