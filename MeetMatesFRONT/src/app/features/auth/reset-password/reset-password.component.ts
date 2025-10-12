import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  isSubmitting = false;
  formSubmitted = false;
  token: string | null = null;

  constructor() {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.notification.showError('Veuillez remplir correctement tous les champs avant de continuer.');
      this.isSubmitting = false;
      return;
    }

    const { newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.notification.showError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!this.token) {
      this.notification.showError('Lien de réinitialisation invalide ou expiré.');
      return;
    }

    this.isSubmitting = true;

    this.authService
      .resetPassword({ token: this.token, newPassword })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.notification.showSuccess('✅ Mot de passe réinitialisé avec succès !');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('[Auth] Erreur reset password :', err);
          this.notification.showError(err?.message || '❌ Erreur lors de la réinitialisation du mot de passe.');
        },
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
