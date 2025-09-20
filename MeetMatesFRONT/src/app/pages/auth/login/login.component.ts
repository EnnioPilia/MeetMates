import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';
import { SharedTitleComponent } from '../../../shared/components/shared-title/shared-title.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    SharedButtonComponent,
    AlertComponent,
    RouterModule,
    SharedTitleComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';
  alertVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showAlert('Veuillez corriger les erreurs du formulaire.', 'error');
      return;
    }

    this.loading = true;
    this.hideAlert();

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.showAlert(err?.message || 'Erreur serveur, veuillez réessayer plus tard.', 'error');
      }
    });
  }

  showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
      this.alertMessage = null;
    }, 5000);
  }

  hideAlert() {
    this.alertVisible = false;
    this.alertMessage = null;
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
