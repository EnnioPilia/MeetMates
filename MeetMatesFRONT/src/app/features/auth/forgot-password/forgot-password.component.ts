import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Shared components
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppInputComponent,
    AppButtonComponent
  ],
})
export class ForgotPasswordComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isSubmitting = false;

  // ✅ Plus de "null" grâce à NonNullableFormBuilder
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    this.isSubmitting = true;

    const { email } = this.form.getRawValue();

    this.authService
      .requestPasswordReset(email.trim().toLowerCase())
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (message) => {
          this.notification.showSuccess(
            message || '✅ Un lien de réinitialisation a été envoyé à votre adresse e-mail.'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('[Auth] Erreur reset password :', err);
          if (err.status === 404) {
            this.notification.showWarning('Aucun compte associé à cet e-mail.');
          } else {
            this.notification.showError(
              err.error?.message || '❌ Une erreur est survenue. Veuillez réessayer.'
            );
          }
          this.cdr.markForCheck();
        },
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
