import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, switchMap, catchError, finalize, tap, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {

    private authService = inject(AuthService);
    private users = inject(UserService);
    private signals = inject(SignalsService);
    private notification = inject(NotificationService);
    private errorHandler = inject(ErrorHandlerService);
    private router = inject(Router);

    isSubmitting = false;

    /* REGISTER */
    register(payload: any) {
        this.isSubmitting = true;

        return this.authService.register(payload).pipe(
            tap(res => {
                this.notification.showSuccess(res.message);
                this.router.navigate(['/login']);
            }),

            catchError(err => {
                this.errorHandler.handle(err);
                return of(null);
            }),

            finalize(() => (this.isSubmitting = false))
        );
    }

    /* LOGIN */
    login(email: string, password: string) {
        this.isSubmitting = true;

        return this.authService.login({ email, password }).pipe(

            switchMap(res =>
                this.users.getCurrentUser().pipe(
                    tap(user => {
                        this.signals.updateCurrentUser(user);
                        this.notification.showSuccess(res.message);
                        this.router.navigate(['/home']);
                    })
                )
            ),

            catchError(err => {
                this.errorHandler.handle(err);
                return of(null);
            }),

            finalize(() => this.isSubmitting = false)
        );
    }

    /* FORGOT PASSWORD */
    requestPasswordReset(email: string) {
        this.isSubmitting = true;

        return this.authService.requestPasswordReset({ email }).pipe(

            tap(res => {
                this.notification.showSuccess(res.message);
                this.router.navigate(['/login']);
            }),

            catchError(err => {
                this.errorHandler.handle(err);
                return of(null);
            }),

            finalize(() => this.isSubmitting = false)
        );
    }

    /* RESET PASSWORD */
    resetPassword(token: string, newPassword: string) {
        this.isSubmitting = true;

        return this.authService.resetPassword({ token, newPassword }).pipe(

            tap(res => {
                this.notification.showSuccess(res.message);
                this.router.navigate(['/login']);
            }),

            catchError(err => {
                this.errorHandler.handle(err);
                return of(null);
            }),

            finalize(() => (this.isSubmitting = false))
        );
    }

    /* VERIFY EMAIL */
    verifyEmail(token: string) {
        this.isSubmitting = true;

        return this.authService.verifyEmail(token).pipe(

            tap(res => {
                this.notification.showSuccess(res.message);
            }),

            switchMap(() => of(true)),

            catchError(err => {
                this.errorHandler.handle(err);
                return of(false);
            }),

            finalize(() => (this.isSubmitting = false))
        );
    }
    
    /* LOGOUT */
    logout() {
        this.isSubmitting = true;

        return this.authService.logout().pipe(
            tap(res => {
                this.notification.showSuccess(res.message);
                this.signals.clearCurrentUser();
                this.router.navigate(['/login']);
            }),
            catchError(err => {
                this.errorHandler.handle(err);
                return of(null);
            }),
            finalize(() => (this.isSubmitting = false))
        );
    }

}
