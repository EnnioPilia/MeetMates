import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppButtonComponent } from '../../../shared-components/button/button.component'; 

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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppButtonComponent
  ]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  formSubmitted = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir correctement tous les champs avant de continuer.');
      return;
    }

    const { email, password } = this.form.value;

    this.isSubmitting = true;

    this.authService
      .login({
        email: email.trim().toLowerCase(),
        password,
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.notification.showSuccess('✅ Connexion réussie !');
          this.router.navigate(['/home']);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[Auth] Erreur connexion :', err);
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
