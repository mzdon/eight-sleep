import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataInternalServerError extends HttpError {
  constructor() {
    super(
      '[SleepData] Something unexpected happened.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export default SleepDataInternalServerError;
