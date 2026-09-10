import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  0: 'Unable to connect to the server. Please check your internet connection.',
  400: 'Invalid request. Please check the submitted data.',
  401: 'Authentication required. Please sign in again.',
  403: 'Access denied. You do not have permission for this action.',
  404: 'Requested resource was not found.'
};

export class AppApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly originalError: HttpErrorResponse
  ) {
    super(message);
    this.name = 'AppApiError';
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userFriendlyMessage = HTTP_ERROR_MESSAGES[error.status];

      if (!userFriendlyMessage) {
        if (error.status >= 500) {
          userFriendlyMessage = 'Server encountered an error. Please try again later.';
        } else {
          userFriendlyMessage = 'An unexpected error occurred. Please try again.';
        }
      }

      return throwError(() => new AppApiError(userFriendlyMessage, error.status, error));
    })
  );
};
