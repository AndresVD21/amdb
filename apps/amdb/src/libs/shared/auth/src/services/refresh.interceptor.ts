import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {

  private auth = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.auth.getToken();

    const authReq = token
      ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          return this.auth.refreshToken().pipe(
            switchMap(res => {
              this.auth.saveToken(res.accessToken);
              const retryReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`) });
              return next.handle(retryReq);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
