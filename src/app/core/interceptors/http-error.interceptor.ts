import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userFriendlyMessage = 'An unexpected error occurred. Please try again.';

      if (error.status === 0) {
        userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 400) {
        userFriendlyMessage = 'Invalid request. Please check the submitted data.';
      } else if (error.status === 401) {
        userFriendlyMessage = 'Authentication required. Please sign in again.';
      } else if (error.status === 403) {
        userFriendlyMessage = 'Access denied. You do not have permission for this action.';
      } else if (error.status === 404) {
        userFriendlyMessage = 'Requested resource was not found.';
      } else if (error.status >= 500) {
        userFriendlyMessage = 'Server encountered an error. Please try again later.';
      }

      const enhancedError = new Error(userFriendlyMessage);
      (enhancedError as any).status = error.status;
      (enhancedError as any).originalError = error;

      return throwError(() => enhancedError);
    })
  );
};
