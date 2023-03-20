import HttpError from '../../shared/HttpError';
import {HttpStatus} from '../../types';

class SleepDataBadRequestError extends HttpError {
  constructor() {
    super('[SleepData] Bad request.', HttpStatus.BAD_REQUEST);
  }
}

export default SleepDataBadRequestError;
