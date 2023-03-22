import {Observable} from '@stated-library/interface';
import {from as rxFrom, Observable as RxObservable} from 'rxjs';

export const from = <T = any>(obs: Observable<T>) => {
  return rxFrom(obs as RxObservable<T>);
};
