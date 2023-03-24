import {DataPoint} from '../components/LineChart';

export const determineDataPointAverage = (data: DataPoint[]): number | null => {
  if (!data?.length) {
    return null;
  }
  const sum = data.reduce((curr, next) => {
    return curr + next.value;
  }, 0);
  return Math.floor(sum / data.length);
};
