import {HttpStatus} from '../../types';
import SleepDataBadRequestError from './SleepDataBadRequestError';
import SleepDataConflictError from './SleepDataConflictError';
import SleepDataForbiddenError from './SleepDataForbiddenError';
import SleepDataInternalServerError from './SleepDataInternalServerError';
import SleepDataNotFoundError from './SleepDataNotFoundError';
import SleepDataServiceUnavailableError from './SleepDataServiceUnavailableError';
import SleepDataUnauthorizedError from './SleepDataUnauthorizedError';
import SleepDataUnprocessableEntityError from './SleepDataUnprocessableEntityError';

const SleepDataClientErrors = new Map();

SleepDataClientErrors.set(HttpStatus.BAD_REQUEST, SleepDataBadRequestError);
SleepDataClientErrors.set(HttpStatus.UNAUTHORIZED, SleepDataUnauthorizedError);
SleepDataClientErrors.set(HttpStatus.FORBIDDEN, SleepDataForbiddenError);
SleepDataClientErrors.set(HttpStatus.NOT_FOUND, SleepDataNotFoundError);
SleepDataClientErrors.set(HttpStatus.CONFLICT, SleepDataConflictError);
SleepDataClientErrors.set(
  HttpStatus.UNPROCESSABLE_ENTITY,
  SleepDataUnprocessableEntityError,
);
SleepDataClientErrors.set(
  HttpStatus.INTERNAL_SERVER_ERROR,
  SleepDataInternalServerError,
);
SleepDataClientErrors.set(
  HttpStatus.SERVICE_UNAVAILABLE,
  SleepDataServiceUnavailableError,
);

export default SleepDataClientErrors;
