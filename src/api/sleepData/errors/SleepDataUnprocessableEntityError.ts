import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataUnprocessableEntityError extends HttpError {
  constructor() {
    super(
      '[SleepData] Unprocessable entity.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export default SleepDataUnprocessableEntityError;
