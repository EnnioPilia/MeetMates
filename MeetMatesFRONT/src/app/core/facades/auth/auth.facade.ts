import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap, of } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';

import { RegisterRequest } from '../../models/auth.model';
import { BaseFacade } from '../base/base.facade';

@Injectable({ providedIn: 'root' })
export class AuthFacade extends BaseFacade {

  private authService = inject(AuthService);
  private users = inject(UserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  // ⭐ EXACTEMENT COMME TU AVAIS
  isSubmitting = false;

  private start() { this.isSubmitting = true; }
  private stop() { this.isSubmitting = false; }

  /* REGISTER */
  register(payload: RegisterRequest) {
    this.start();
    this.startLoading();

    return this.authService.register(payload).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError(undefined, () => this.stop())
    );
  }

  /* LOGIN */
  login(email: string, password: string) {
    this.start();
    this.startLoading();

    return this.authService.login({ email, password }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/home']);
      }),
      this.handleError(undefined, () => this.stop())
    );
  }


  /* FORGOT PASSWORD */
  requestPasswordReset(email: string) {
    this.start();
    this.startLoading();

    return this.authService.requestPasswordReset({ email }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }

  /* RESET PASSWORD */
  resetPassword(token: string, newPassword: string) {
    this.start();
    this.startLoading();

    return this.authService.resetPassword({ token, newPassword }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }

  /* VERIFY EMAIL */
  verifyEmail(token: string) {
    this.start();
    this.startLoading();

    return this.authService.verifyEmail(token).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
      }),
      switchMap(() => of(true)),
      this.handleError()
    );
  }

  /* LOGOUT */
  logout() {
    this.start();
    this.startLoading();

    return this.authService.logout().pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.signals.clearCurrentUser();
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }
}
