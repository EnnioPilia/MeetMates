import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { finalize } from 'rxjs/operators';

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
    MatSnackBarModule,
    
  ]
})
export class LoginComponent {
  form: FormGroup;
  isSubmitting = false;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
      private cdr: ChangeDetectorRef // ✅ Ajout

  ) {
    this.form = this.fb.group({
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
    this.isSubmitting = false;
    return;
  }

  const { email, password } = this.form.value;
  this.isSubmitting = true;

    this.authService.login({ email: email.trim().toLowerCase(), password }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.snackBar.open('✅ Connexion réussie !', 'Fermer', {
          panelClass: ['snack-success'],
          duration: 2000,
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isSubmitting = false; // ✅ toujours libérer ici aussi
        console.error('[Auth] Erreur connexion :', err);
        this.snackBar.open(err.message || '❌ Échec de la connexion.', 'Fermer', {
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
