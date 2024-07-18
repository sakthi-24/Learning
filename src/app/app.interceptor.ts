import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from './data.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private dataService: DataService
  ) {}

  intercept( req: HttpRequest<any>,  next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.cookieService.get('accessToken');
    const refreshToken = this.cookieService.get('refreshToken');

    let clonedRequest = req;
    if (accessToken) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && refreshToken) {
          return this.dataService.refreshToken().pipe(
            switchMap((newAccessToken: string) => {
              this.cookieService.set('accessToken', newAccessToken);
              const retryRequest = clonedRequest.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              return next.handle(retryRequest);
            }),
            catchError((refreshError) => {
              this.dataService.logout();
              return EMPTY;
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
