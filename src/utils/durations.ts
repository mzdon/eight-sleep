import moment from 'moment';
import {UserSleepData} from '../state/sleep';

export type Duration = [string, string];

export enum DurationType {
  DAY = 'DAY',
  WEEK = 'WEEK',
}

// a duration starts at noon the day before the target startOfDuration and ends
// at noon of last day of the target startOfDuration
// i.e. ts = '2017-03-07T00:00:00.000Z';
// startOfDuration = 'day';
// duration = ['2017-03-05T17:00:00.000Z', '2017-03-06T16:59:59.999Z'];
// startOfDuration = 'week';
// duration = ['2017-03-04T17:00:00.000Z', '2017-03-11T16:59:59.999Z'];
export const getDuration = (
  ts: string | undefined,
  startOfDuration: moment.unitOfTime.StartOf,
): Duration => {
  // determine if ts is at night on one day or early in the morning the next day
  const m = moment(ts);
  // get the start of day of the time stamp
  const tsDayStart = m.clone().startOf('day');
  // subtract 12 hours and get the start of that day
  const tsSub12Hours = m.clone().subtract(12, 'hours');
  const tsSub12HoursDayStart = tsSub12Hours.startOf('day');
  // if they are the same, ts is at night on one day
  // if they are not the same, ts is early in the morning the next day
  if (tsDayStart.isSame(tsSub12HoursDayStart)) {
    // return noon the same day as ts and noon the day after ts
    return [
      moment(ts).startOf(startOfDuration).add(12, 'hours').toISOString(),
      moment(ts)
        .endOf(startOfDuration)
        .add(1, 'day')
        .subtract(12, 'hours')
        .toISOString(),
    ];
  } else {
    // return noon the prior day as ts and noon the same day as ts
    return [
      moment(ts)
        .startOf(startOfDuration)
        .subtract(1, 'day')
        .add(12, 'hours')
        .toISOString(),
      moment(ts).endOf(startOfDuration).subtract(12, 'hours').toISOString(),
    ];
  }
};

export const getMomentIteratorFromDuration = (duration: Duration) => {
  return {
    [Symbol.iterator]() {
      let m = moment(duration[0]);
      const end = moment(duration[1]);
      return {
        next: () => {
          if (m.isBefore(end)) {
            const result = {value: m, done: false};
            m = m.clone().add(1, 'day');
            return result;
          }
          return {value: m, done: true};
        },
      };
    },
  };
};

export const getMostRecentDuration = (
  sleepData: UserSleepData | null,
  startOfDuration: moment.unitOfTime.StartOf,
): Duration => {
  const ts = sleepData?.intervals[0]?.ts ?? undefined;
  return getDuration(ts, startOfDuration);
};

export const getMostRecentDayDuration = (
  sleepData: UserSleepData | null,
): Duration => getMostRecentDuration(sleepData, 'day');

export const getMostRecentWeekDuration = (
  sleepData: UserSleepData | null,
): Duration => getMostRecentDuration(sleepData, 'week');

export const getDefaultDuration = (
  sleepData: UserSleepData | null,
  durationType: DurationType,
): Duration => {
  switch (durationType) {
    case DurationType.DAY:
      return getMostRecentDayDuration(sleepData);
    case DurationType.WEEK:
      return getMostRecentWeekDuration(sleepData);
    default:
      throw new Error(`Unknown duration type: ${durationType}`);
  }
};

export const mapDurationTypeToStartOfDuration = (
  durationType: DurationType,
): moment.unitOfTime.StartOf => {
  switch (durationType) {
    case DurationType.DAY:
      return 'day';
    case DurationType.WEEK:
      return 'week';
    default:
      throw new Error(`Unrecognized DurationType: ${durationType}`);
  }
};

export const getDurationForNextDurationType = (
  lastDuration: Duration,
  durationType: DurationType,
  minDate?: string,
  maxDate?: string,
) => {
  const startOfDuration = mapDurationTypeToStartOfDuration(durationType);
  // always use the higher duration bound so we end up with the most recent date
  // from the previous duration as we reduce duration length (i.e. last day of
  // the week we were just using)
  const newDuration = getDuration(
    moment(lastDuration[1]).add(12, 'hours').toISOString(),
    startOfDuration,
  );
  if (minDate) {
    // if the new upper duration bound is before the min date return a duration based on the min date
    const min = moment(minDate);
    if (moment(newDuration[1]).isBefore(min)) {
      return getDuration(minDate, startOfDuration);
    }
  }
  if (maxDate) {
    // if the new lower duration bound is after the max date return a duration based on the max date
    const max = moment(maxDate);
    if (moment(newDuration[0]).isAfter(max)) {
      return getDuration(maxDate, startOfDuration);
    }
  }
  return newDuration;
};

// duration[1] should already be just before noon on the last date of the
// duration duration, passing duration[1] + 1 day to getDuration will create the
// next duration correctly
export const getNextDuration = (
  duration: Duration,
  durationType: DurationType,
): Duration =>
  getDuration(
    moment(duration[1]).add(1, 'day').toISOString(),
    mapDurationTypeToStartOfDuration(durationType),
  );

// duration[0] should already be at noon on the earliest date of the duration,
// passing duration[0] - 12 hours to getDuration will create the previous
// duration correctly
export const getPreviousDuration = (
  duration: Duration,
  durationType: DurationType,
): Duration =>
  getDuration(
    moment(duration[0]).subtract(12, 'hours').toISOString(),
    mapDurationTypeToStartOfDuration(durationType),
  );

export const getFormattedDuration = (
  duration: Duration,
  formats: string | string[],
) => {
  let _formats = formats;
  if (!Array.isArray(_formats)) {
    _formats = [_formats];
  }
  return _formats.map(format => {
    const start = moment(duration[0]);
    // we subtract 12 hours because the end of our duration is 12 hours into the
    // day after the end of the actual duration
    const end = moment(duration[1]).subtract(12, 'hours');
    return [start.format(format), end.format(format)];
  });
};
