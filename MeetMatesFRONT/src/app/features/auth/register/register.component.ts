import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../../../core/services/auth/auth.service';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';
import { SharedTitleComponent } from '../../../shared/components/shared-title/shared-title.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    SharedButtonComponent,
    RouterModule,
    SharedTitleComponent,
    ToastComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;  // <-- ajoute cette ligne
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' | 'warning' = 'info';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      age: [, [Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }
  get nomControl(): FormControl {
    return this.registerForm.get('nom') as FormControl;
  }

  get prenomControl(): FormControl {
    return this.registerForm.get('prenom') as FormControl;
  }

  get ageControl(): FormControl {
    return this.registerForm.get('age') as FormControl;
  }


  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const registerData: RegisterRequest = {
      name: `${this.prenomControl.value} ${this.nomControl.value}`,
      email: this.emailControl.value,
      password: this.passwordControl.value,
      age: this.ageControl.value,
    };

    this.authService.register(registerData).subscribe({
      next: (res: any) => {
        this.loading = false;
        const message = res?.text || 'Un lien vous a été envoyé sur votre boîte mail pour valider votre compte';

        this.showToast(message, 'success');  // ✅ Toast succès uniquement
        this.registerForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Une erreur est survenue, veuillez réessayer.';
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);
  }
  
  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}


