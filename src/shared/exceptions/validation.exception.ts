import { BadRequestException, ValidationError } from '@nestjs/common';
import { errorCodes } from '../errorCodes';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(validationErrors);
  }
}

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const formatError = (errors: ValidationError[]) => {
    const errMsg = {};
    errors.forEach((error: ValidationError) => {
      errMsg[error.property] = [...Object.values(error.constraints)];
    });
    return errMsg;
  };
  return new ValidationException({
    errorCode: errorCodes.VALIDATION_ERROR.code,
    error: errorCodes.VALIDATION_ERROR.description,
    errors: formatError(errors),
  });
};
