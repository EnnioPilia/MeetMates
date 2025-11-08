import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, catchError, EMPTY } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler/error-handler.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  private errorHandler = inject(ErrorHandlerService); 
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isSubmitting = false;

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
        catchError((err) => {
          this.errorHandler.handle(err);
          this.cdr.markForCheck();
          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((message) => {
        this.notification.showSuccess('✅ Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        this.router.navigate(['/login']);
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
