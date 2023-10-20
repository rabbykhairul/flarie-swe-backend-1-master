import { BadRequestException, ValidationError } from '@nestjs/common';

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
    message: 'Bad Request! Please use correct payload.',
    statusCode: 400,
    errors: formatError(errors),
  });
};
