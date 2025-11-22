import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { MatCardModule } from '@angular/material/card';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class ForgotPasswordComponent {

  private fb = inject(NonNullableFormBuilder);
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    const email = this.form.getRawValue().email.trim().toLowerCase();

    this.authFacade
      .requestPasswordReset(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }
}
