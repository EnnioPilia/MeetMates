import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, catchError, tap, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { RegisterRequest } from '../../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {

  private authService = inject(AuthService);
  private users = inject(UserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);

  /** ⛔ Ajout ici */
  isSubmitting = false;

  /** Helper interne */
  private start() { this.isSubmitting = true; }
  private stop() { this.isSubmitting = false; }

  /* REGISTER */
  register(payload: RegisterRequest) {
    this.start();
    return this.authService.register(payload).pipe(
      tap(res => {
        this.stop();
        this.notification.showSuccess(res.message);
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        this.stop();
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }

  /* LOGIN */
  login(email: string, password: string) {
    this.start();
    return this.authService.login({ email, password }).pipe(
      switchMap(res =>
        this.users.getCurrentUser().pipe(
          tap(userRes => {
            this.stop();
            this.signals.updateCurrentUser(userRes.data);
            this.notification.showSuccess(res.message);
            this.router.navigate(['/home']);
          })
        )
      ),
      catchError(err => {
        this.stop();
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }

  /* FORGOT PASSWORD */
  requestPasswordReset(email: string) {
    this.start();
    return this.authService.requestPasswordReset({ email }).pipe(
      tap(res => {
        this.stop();
        this.notification.showSuccess(res.message);
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        this.stop();
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }

  /* RESET PASSWORD */
  resetPassword(token: string, newPassword: string) {
    this.start();
    return this.authService.resetPassword({ token, newPassword }).pipe(
      tap(res => {
        this.stop();
        this.notification.showSuccess(res.message);
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        this.stop();
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }

  /* VERIFY EMAIL */
  verifyEmail(token: string) {
    this.start();
    return this.authService.verifyEmail(token).pipe(
      tap(res => {
        this.stop();
        this.notification.showSuccess(res.message);
      }),
      switchMap(() => of(true)),
      catchError(err => {
        this.stop();
        this.errorHandler.handle(err);
        return of(false);
      })
    );
  }

  /* LOGOUT */
  logout() {
    this.start();
    return this.authService.logout().pipe(
      tap(res => {
        this.stop();
        this.notification.showSuccess(res.message);
        this.signals.clearCurrentUser();
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        this.stop();
        this.errorHandler.handle(err);
        return of(null);
      })
    );
  }
}
