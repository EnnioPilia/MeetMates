import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { UserService } from '../../../core/services/user/user.service';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { MatCardModule } from '@angular/material/card';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

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
        finalize(() => (this.isSubmitting = false))
      )
      .subscribe({
        next: (user) => {
          this.signals.updateCurrentUser(user);
          this.notification.showSuccess('✅ Connexion réussie !');
          this.router.navigate(['/home']);
          this.cdr.markForCheck();
        },
        error: (err) => {
          if (err.status === 401) {
            this.notification.showError('Identifiants incorrects.');
          } else {
            this.notification.showError(err.error?.message || '❌ Échec de la connexion.');
          }
          this.cdr.markForCheck();
        },
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
