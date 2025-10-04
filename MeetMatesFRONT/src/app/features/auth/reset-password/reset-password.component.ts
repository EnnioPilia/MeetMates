import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs/operators';

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
    MatSnackBarModule
  ]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isSubmitting = false;
  formSubmitted = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.resetForm.invalid) {
      this.snackBar.open('Veuillez remplir correctement les champs.', 'Fermer', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.snackBar.open('Les mots de passe ne correspondent pas.', 'Fermer', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }

    if (!this.token) {
      this.snackBar.open('Lien de réinitialisation invalide ou expiré.', 'Fermer', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }

    this.isSubmitting = true;

    this.authService.resetPassword({ token: this.token, newPassword })
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.snackBar.open('✅ Mot de passe réinitialisé avec succès.', 'Fermer', {
            duration: 4000,
            panelClass: ['snack-success']
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('[Auth] Erreur reset password :', err);
          this.snackBar.open(err.message || '❌ Erreur lors de la réinitialisation.', 'Fermer', {
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
