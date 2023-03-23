import moment from 'moment';
import {Reducer, useEffect, useReducer, useRef} from 'react';
import {UserSleepData} from '../../state/sleep';
import {
  Duration,
  DurationType,
  getDefaultDuration,
  getDurationForNextDurationType,
  getNextDuration,
  getPreviousDuration,
} from '../../utils';

// TYPES
// REDUCER STATE
interface DurationState {
  durationType: DurationType;
  selectedDuration: Duration;
  minDate: string;
  maxDate: string;
}

// REDUCER ACTIONS
enum DurationActionsType {
  SET_SELECTED_DURATION_TYPE = 'SET_SELECTED_DURATION_TYPE',
  SELECT_NEXT_DURATION = 'SELECT_NEXT_DURATION',
  SELECT_PREVIOUS_DURATION = 'SELECT_PREVIOUS_DURATION',
  SET_MIN_MAX_DATES = 'SET_MIN_MAX_DATES',
  _REINITIALIZE = '_REINITIALIZE',
}

type Action<T extends DurationActionsType, P> = {
  type: T;
} & P;

type SelectNextDurationAction = Action<
  DurationActionsType.SELECT_NEXT_DURATION,
  {}
>;
type SelectPreviousDurationAction = Action<
  DurationActionsType.SELECT_PREVIOUS_DURATION,
  {}
>;
type SetSelectedDurationTypeAction = Action<
  DurationActionsType.SET_SELECTED_DURATION_TYPE,
  {durationType: DurationType}
>;
type SetMinMaxDatesAction = Action<
  DurationActionsType.SET_MIN_MAX_DATES,
  {minDate: string; maxDate: string}
>;
type PrivateReinitializeAction = Action<
  DurationActionsType._REINITIALIZE,
  {state: DurationState}
>;
type DurationReducerActions =
  | SelectNextDurationAction
  | SelectPreviousDurationAction
  | SetSelectedDurationTypeAction
  | SetMinMaxDatesAction
  | PrivateReinitializeAction;

export type DurationReducer = Reducer<DurationState, DurationReducerActions>;

// IMPLEMENTATION
// ACTIONS
// PUBLIC
export const setDurationTypeAction = (
  durationType: DurationType,
): SetSelectedDurationTypeAction => ({
  type: DurationActionsType.SET_SELECTED_DURATION_TYPE,
  durationType,
});
export const selectPreviousDurationAction =
  (): SelectPreviousDurationAction => ({
    type: DurationActionsType.SELECT_PREVIOUS_DURATION,
  });
export const selectNextDurationAction = (): SelectNextDurationAction => ({
  type: DurationActionsType.SELECT_NEXT_DURATION,
});

// PRIVATE
const _reinitializeAction = (
  state: DurationState,
): PrivateReinitializeAction => ({
  type: DurationActionsType._REINITIALIZE,
  state,
});

// REDUCER
export function durationReducer(
  state: DurationState,
  action: DurationReducerActions,
): DurationState {
  switch (action.type) {
    case DurationActionsType.SET_SELECTED_DURATION_TYPE:
      return {
        ...state,
        selectedDuration: getDurationForNextDurationType(
          state.selectedDuration,
          action.durationType,
        ),
        durationType: action.durationType,
      };
    case DurationActionsType.SELECT_NEXT_DURATION:
      return {
        ...state,
        selectedDuration: getNextDuration(
          state.selectedDuration,
          state.durationType,
        ),
      };
    case DurationActionsType.SELECT_PREVIOUS_DURATION:
      return {
        ...state,
        selectedDuration: getPreviousDuration(
          state.selectedDuration,
          state.durationType,
        ),
      };
    case DurationActionsType.SET_MIN_MAX_DATES:
      return {
        ...state,
        minDate: action.minDate,
        maxDate: action.maxDate,
      };
    case DurationActionsType._REINITIALIZE:
      return {
        ...action.state,
      };
    default:
      return state;
  }
}

export function getDefaultDurationState(sleepData: UserSleepData | null) {
  const durationType = DurationType.DAY;
  return {
    durationType,
    selectedDuration: getDefaultDuration(sleepData, durationType),
    // no min/maxDates, default to yesterday
    minDate: sleepData?.minDate ?? moment().subtract(1, 'day').toISOString(),
    maxDate:
      sleepData?.maxDate ??
      moment().subtract(1, 'day').endOf('day').toISOString(),
  };
}

const useSleepReportReducer = (sleepData: UserSleepData | null) => {
  const reducer = useReducer<DurationReducer, UserSleepData | null>(
    durationReducer,
    sleepData,
    getDefaultDurationState,
  );

  // if the consumer recieves a different set of sleep data after initial render
  // this will reinitialize the reducer state
  const [, dispatch] = reducer;
  const initialRenderRef = useRef(true);
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    } else {
      dispatch(_reinitializeAction(getDefaultDurationState(sleepData)));
    }
  }, [dispatch, sleepData]);

  return reducer;
};

export default useSleepReportReducer;
