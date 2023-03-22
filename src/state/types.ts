import {SleepInterval} from '../api';

export interface AppState {
  sleepData: SleepInterval | null;
  selectUser: (userUuid: string) => void;
}
