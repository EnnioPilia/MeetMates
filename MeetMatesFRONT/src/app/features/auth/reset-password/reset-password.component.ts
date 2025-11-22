import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';

import { MatCardModule } from '@angular/material/card';
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppInputComponent,
    AppButtonComponent,
  ],
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  token: string | null = null;

  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir correctement tous les champs.');
      return;
    }

    const { newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      this.notification.showError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!this.token) {
      this.notification.showError('❌ Lien de réinitialisation invalide ou expiré.');
      return;
    }

    this.authFacade
      .resetPassword(this.token, newPassword)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }
}
