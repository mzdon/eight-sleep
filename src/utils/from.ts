import {Observable} from '@stated-library/interface';
import {from as rxFrom, Observable as RxObservable} from 'rxjs';

// primarily a convenience function to keep TypeScript happy
// could implement additional observable functionality like logging, etc
export const from = <T = any>(obs: Observable<T>) => {
  return rxFrom(obs as RxObservable<T>);
};
