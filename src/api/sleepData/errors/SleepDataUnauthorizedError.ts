import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataUnauthorizedError extends HttpError {
  constructor() {
    super('[SleepData] Unauthorized.', HttpStatus.UNAUTHORIZED);
  }
}

export default SleepDataUnauthorizedError;
