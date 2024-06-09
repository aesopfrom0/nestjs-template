import { HttpException } from '@nestjs/common';
import { ErrorCode } from '@/shared/exceptions/error-code';

class ApplicationException extends Error {
  public constructor(httpError: HttpException, errorCode: ErrorCode = ErrorCode.UNKNOWN_ERROR) {
    super(
      JSON.stringify({
        httpError: httpError,
        errorCode,
      }),
    );
  }
}

export default ApplicationException;
