import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  alertVisible = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    const { email } = this.forgotForm.value;

this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.alertMessage = '✅ Un email de réinitialisation a été envoyé.';
        this.alertType = 'success';
        this.alertVisible = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur forgot password', err);
        this.alertMessage = '❌ Impossible d’envoyer le lien. Vérifie ton adresse.';
        this.alertType = 'error';
        this.alertVisible = true;
        this.loading = false;
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
