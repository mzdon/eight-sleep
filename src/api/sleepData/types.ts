export interface TimeSeries {
  tnt: [string, number][]; // ISO-8601
  tempRoomC: [string, number][]; // ISO-8601, celsius
  tempBedC: [string, number][]; // ISO-8601, celsius
  respiratoryRate: [string, number][]; // ISO-8601, breath/min
  heartRate: [string, number][]; // ISO-8601, beat/min
}

export enum StageEnum {
  AWAKE = 'awake',
  OUT = 'out',
  LIGHT = 'light',
  DEEP = 'deep',
}

export interface Stage {
  stage: StageEnum;
  duration: number;
}

export interface SleepInterval {
  id: string;
  ts: string; // ISO-8601
  stages: Stage[];
  score: number;
  timeseries: TimeSeries;
}

export interface UserSleepDataResponse {
  intervals: SleepInterval[];
}
