import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataNotFoundError extends HttpError {
  constructor() {
    super('[SleepData] Not found.', HttpStatus.NOT_FOUND);
  }
}

export default SleepDataNotFoundError;
