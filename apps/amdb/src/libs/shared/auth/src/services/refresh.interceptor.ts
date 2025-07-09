import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);

  // Skip authorization for Jikan API requests
  if (req.url.includes('api.jikan.moe')) {
    return next(req);
  }

  const token = auth.getToken();

  // Clone request with or without auth header based on token presence
  const clonedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
    : req.clone({
        withCredentials: true
      });

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403) {
        return auth.refreshToken().pipe(
          switchMap(res => {
            auth.saveToken(res.accessToken);

            // Create base request clone
            const retryReq = req.clone({ withCredentials: true });

            // Add Authorization header if we have a token
            return next(res.accessToken
              ? retryReq.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                })
              : retryReq);
          }),
          catchError(refreshError => {
            // If refresh fails, propagate the original error
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
}
