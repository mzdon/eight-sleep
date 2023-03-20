import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataServiceUnavailableError extends HttpError {
  constructor() {
    super(
      '[SleepData] Service unavailable, try again later.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export default SleepDataServiceUnavailableError;
