import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class RegisterComponent {

  form: FormGroup;
  isSubmitting = false;
  formSubmitted = false; // 🟡 Pour savoir si l’utilisateur a cliqué sur “S’inscrire”

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



onSubmit(): void {
  this.formSubmitted = true;

  if (this.form.invalid) {
    this.snackBar.open(
      'Veuillez remplir correctement tous les champs avant de continuer.',
      'Fermer',
      {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-error'],
      }
    );
    return;
  }

    const { name, email, password } = this.form.value;
    const request: RegisterRequest = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'USER'
    };

    this.isSubmitting = true;

    this.authService.register(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('✅ Inscription réussie ! Vérifiez votre email.', 'Fermer', {
          panelClass: ['snack-success'],
          duration: 4000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('[Auth] Erreur inscription :', err);
        this.snackBar.open(err.message || "❌ Erreur lors de l'inscription.", 'Fermer', {
          duration: 4000,
          panelClass: ['snack-error']
        });
      }
    });
  }
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
