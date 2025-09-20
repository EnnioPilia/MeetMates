import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth/auth.service';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    SharedButtonComponent,
    ToastComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  loading = false;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' | 'warning' = 'info';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get passwordControl(): FormControl {
    return this.resetForm.get('newPassword') as FormControl;
  }

  ngOnInit(): void {
    // Récupération uniquement du token UUID depuis l'URL
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (!tokenParam) {
      this.showToast("Token de réinitialisation manquant dans l'URL.", 'error');
    } else {
      this.token = tokenParam;
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 5000);
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      if (!this.token) this.showToast("Token invalide ou manquant.", 'error');
      return;
    }

    this.loading = true;

    this.authService.resetPassword({
      token: this.token,             // uniquement UUID
      newPassword: this.passwordControl.value
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.showToast(res || "Mot de passe réinitialisé avec succès.", 'success');
        this.router.navigate(['/login']); // redirection après succès
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err?.error || err?.message || "Erreur lors de la réinitialisation.";
        this.showToast(msg, 'error');
      }
    });
  }
}
