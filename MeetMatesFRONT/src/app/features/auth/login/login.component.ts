import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, switchMap, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { UserService } from '../../../core/services/user/user.service';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { ErrorHandlerService } from '../../../core/services/error-handler/error-handler.service'; 
import { MatCardModule } from '@angular/material/card';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService); 
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  isSubmitting = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir correctement tous les champs.');
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.isSubmitting = true;

    this.authService
      .login({ email: email.trim().toLowerCase(), password })
      .pipe(
        switchMap(() => this.userService.getCurrentUser()),
        catchError((err) => {
          this.errorHandler.handle(err);
          this.cdr.markForCheck();
          return EMPTY;
        }),

        finalize(() => (this.isSubmitting = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((user) => {
        this.signals.updateCurrentUser(user);
        this.notification.showSuccess('✅ Connexion réussie !');
        this.router.navigate(['/home']);
        this.cdr.markForCheck();
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
