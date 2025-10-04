import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isSubmitting = false;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {;
      return;
    }

    this.isSubmitting = true;
    const { email } = this.form.value;

    this.authService.requestPasswordReset(email).subscribe({
      next: (message) => {
        this.isSubmitting = false;
        this.snackBar.open(
          message || '✅ Un lien de réinitialisation a été envoyé à votre adresse e-mail.',
          'Fermer',
          {
            duration: 4000,
            panelClass: ['snack-success']
          }
        );
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('[Auth] Erreur reset password :', err);
        this.snackBar.open(
          err.message || '❌ Une erreur est survenue. Veuillez réessayer.',
          'Fermer',
          {
            duration: 4000,
            panelClass: ['snack-error']
          }
        );
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
