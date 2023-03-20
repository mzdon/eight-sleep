# Eight Sleep Take Home

- Create repo
- Install React Native + some deps
- Add these implementation notes as .md file
- Write API layer
- Write AppState layer
- Write view Layer

## API Layer
- Use Axios
- ApiClientWrapper - maintain client singletons
  - handle default options like token
  - keep track of singleton instance of client
- AuthClient (nice to have)
  - handle defining API interface methods
    - logIn: (data: LoginDto): Promise<LoginResponse>;
    - signUp: (data: SignUpDto): Promise<void>;
    - requestPasswordReset(username: string): Promise<void>;
  - handle endpoint specific errors
- SleepDataClient
  - handle defining API interface methods
    - fetchUserData(userUuid: string): Promise<UserDataResponse>;
  - handle endpoint specific errors
- UserProfileClient (nice to have)
  - handle defining API interface methods
    - fetchUserProfile(userUuid: string): Promise<UserProfileResponse>;
    - updateUserProfile(data: UpdateUserProfileDto): Promise<UserProfileResponse>;
  - handle endpoint specific errors
- Write unit tests

## App State Layer
- reactive state management (let's try stated-library approach!)
- RootLib: { state$: RootLibState } & RootLibMethods
  - root state can be stored on device and synced with remote data on app startup/focus if at least an hour or so has passed since the last fetch (this duration is variable depending on things like BE/AI processing schedule or when fresh data can be expected to be available) (nice to have)
  - DayIntervalLib: { state$: DayIntervalLibState } & DayIntervalLibMethods
    - derived from RootLib state
  - WeekIntervalLib: { state$: WeekIntervalLibState } & WeekIntervalLibMethods
    - derived from RootLib state
  - MonthIntervalLib: { state$: MonthIntervalLibState } & MonthIntervalLibMethods
    - derived from RootLib state + WeekIntervalLib state
  - YearIternvalLib: { state$: YearIntervalLibState } & YearIntervalLibMethods
    - derived from RootLib state + MonthIntervalLib state
  - UserProfileLib: { state$: UserProfileLibState } & UserProfileLibMethods (nice to have)
    - derived from RootLib state
- interval.ts (time session starts) is always the date of the datapoint
  - i.e. I wake up on Tuesday and the last interval of data is displayed for Monday night
- consider rollup of averages of averages from week to month to year
  - not precise but potentially close enough
  - slightly less complex duration states
  - may speed up computation/time to display
- consider count/sum accumulation across week/month/year as we compute averages
  - precise averages
  - would need to store count/sum for each smaller duration
  - greater duration would need to subscribe to smaller duration state
- consider retaining computed state in [Week|Month|Year]IntervalLibState per user uuid
  - recompute on root state change for that user
  - added complexity to the app
  - would speed up time to display when switching users and duration
- Unit test

## View Layer
- react-navigation (nice to have)
  - login (pre-auth)
  - sleep fitness (post-auth/bottom tab)
  - profile (post-auth/bottom tab)
- header (selected user + hamburger to display available user tray)
- day week month year selector at top
  - local UI/component state
- interval selector component
  - pressable date or date range that will open date picker modal
  - large left/right chevron buttons to move to next day/week/month/year
  - sleep score display
    - day - cirlce + duration
    - week - bar chart + average duration
    - month/year - line chart + average duration
      - year aggregate into week average
- sleep stage component
  - day - step line graph
  - week/month/year - pie chart averages
- toss and turn display
  - day - count
  - week/month/year - average/night
- bed/room temp displays
  - line graph
  - aggregate averages across selected duration for week+
- resp/heart rate displays
  - line graph
  - aggregate averages across selected duration for week+
- same x scale for all graphs
- same height for all graph components
- animate on inital load + selected interval change (nice to have)
- disable animation if reduce motion is enabled
- display fetch error
- RNLocalize to get localization settings (F/C and timezone)
- moment for date formatting
- implement colors for background, text, highlight, primaryButton + text, secondaryButton + text, as a darkmode setting driven theme (natively defined colors using PlatformColor API would be nice)
- include accessibiliy labels
- Snaphot test

## Types
```ts
abstract class ClientWrapper<T> {
  protected client: T;
  constructor(client: T);
  public getClient(): T;
  public setToken(token: string): T;
}

abstract class Client {
  constructor(config: ClientConfig);
  private abstract sendRequest<T = unknown>(req: () => Promise<T>): Promise<T>;
  private abstract handleError(error: uknown): Error;
}

class SleepDataClient implements Client {
  fetchUserData(userUuid: string): Promise<UserDataResponse>;
}

class AuthClient implements Client {
  logIn(data: LoginDto): Promise<LoginResponse>;
  signUp(data: SignUpDto): Promise<SignUpResponse>;
  requestPasswordReset(username: string): Promise<void>;
}

class UserProfileClient implements Client {
  fetchUserProfile(userUuid: string): Promise<UserProfileResponse>;
  updateUserProfile(userUuid: string, data: UpdateUserProfileDto): Promise<UserProfileResponse>;
}

interface LoginDto {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface SignUpDto {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO-8601 - start of day UTC
  username: string;
}

interface TimeSeries {
  tnt: [string, number][]; // ISO-8601
  tempRoomC: [string, number][]; // ISO-8601, celsius
  tempBedC: [string, number][]; // ISO-8601, celsius
  respiratoryRate: [string, number][]; // ISO-8601, breath/min
  heartRate: [string, number][]; // ISO-8601, beat/min
}

interface SleepInterval {
  id: string;
  ts: string; // ISO-8601
  states: Stage[];
  score: number;
  timeseries: TimeSeries;
}

interface UserData {
  intervals: SleepInterval[],
  minDate: string; // ISO-8601
  maxDate: string; // ISO-8601
  lastFetch: string; // ISO-8601
}

interface UserDataResponse {
  data: UserData
}

interface RequestError {
  status: number;
  message: string;
  op?: Function; // bound method that failed, available for retry, closure includes original args, passed args overwrite original args (nice to have?)
}

interface RootLibState {
  requestError: RequestError;
  userSleepData: {
    [uuid: string]: UserData;
  },
  selectedUserUuid: string;
  isFetching: boolean;
}

interface RootLibMethods {
  fetchUserData: (uuid: string) => Promise<void>;
  retryFailedRequest(args?: unknown[]) => Promise<void>;
  selectUser: (uuid: string) => Promiise<void>;
}

interface DayDurationLibState {
  selectedInterval: number; // selected interval ID
}

interface DayDurationLibMethods {
  selectInterval: (intervalId: number) => void;
}

type DateBounds = [string, string]; // ISO-8601 start and end dates

type IntervalIdBounds = [number, number]; // start and end interval ids

type RangeBounds = [DateBounds, IntervalIdBounds];

interface Average {
  average: number;
  sum: number;
  count: number;
}

interface Range {
  bounds: RangeBounds;
  averageSleepState: {
    awake: Average;
    out: Average;
    light: Average;
    deep: Average;
  }
  averageTnt: Average;
  averageRoomTemp: Average;
  averageBedTemp: Average;
  averageRespiratoryRate: Average;
  averageHeartRate: Average;
}

interface RangeUserData {
  ranges: Range[]; // sort desc
}

interface WeekIntervalLibState {
  [uuid: string]: RangeUserData;
}

interface MonthIntervalLibState {
  [uuid: string]: RangeUserData;
}

interface YearIntervalLibState {
  [uuid: string]: RangeUserData;
}

interface UserProfileState {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO-8601 - start of day UTC
  username: string;
}

interface UserProfileLibMethods {
  fetchUserProfile: (uuid: string) => Promise<void>;
  updateUserProfile: (data: PatchUserProfileDto) => Promise<void>;
}
```
