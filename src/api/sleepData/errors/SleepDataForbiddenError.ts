import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataForbiddenError extends HttpError {
  constructor() {
    super('[SleepData] Forbidden.', HttpStatus.FORBIDDEN);
  }
}

export default SleepDataForbiddenError;
