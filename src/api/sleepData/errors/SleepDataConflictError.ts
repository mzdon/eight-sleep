import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataConflictError extends HttpError {
  constructor() {
    super('[SleepData] Conflict.', HttpStatus.CONFLICT);
  }
}

export default SleepDataConflictError;
