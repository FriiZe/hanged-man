import { HttpStatus } from '@nestjs/common';

interface FormattedError {
  error: string;
  message: string[];
  status: HttpStatus;
}

export const formatError = <T extends Error>(
  status: HttpStatus,
  error: T,
  errorMessage: string,
): FormattedError => ({
    error: errorMessage,
    message: [error.message],
    status,
  });
