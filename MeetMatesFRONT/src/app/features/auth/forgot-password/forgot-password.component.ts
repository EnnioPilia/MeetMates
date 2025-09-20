import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    SharedButtonComponent,
    AlertComponent
  ],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  loading = false;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';
  alertVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl(): FormControl {
    return this.forgotForm.get('email') as FormControl;
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      this.showAlert('Adresse email invalide', 'error');
      return;
    }

    this.loading = true;
    this.hideAlert();

    this.authService.requestPasswordReset(this.emailControl.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.showAlert(res?.text || 'Un lien vous a été envoyé par email', 'success');
      },
      error: (err: any) => {
        this.loading = false;
        this.showAlert(err?.error?.text || 'Erreur lors de la demande.', 'error');
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
    }, 3000);
  }

  hideAlert() {
    this.alertVisible = false;
    this.alertMessage = null;
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
