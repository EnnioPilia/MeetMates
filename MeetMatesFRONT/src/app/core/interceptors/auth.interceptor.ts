import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} 
from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './../../core/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    let authReq = req;
    if (accessToken) {
      authReq = this.addTokenHeader(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token expiré ou non valide
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokenResponse: { accessToken: string }) => {
          this.isRefreshing = false;
          localStorage.setItem('accessToken', tokenResponse.accessToken);
          this.refreshTokenSubject.next(tokenResponse.accessToken);
          return next.handle(this.addTokenHeader(request, tokenResponse.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout(); // déconnexion en cas d'échec du refresh
          return throwError(() => err);
        })
      );
    } else {
      // Si déjà en train de rafraîchir, on attend le nouveau token
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }
}
