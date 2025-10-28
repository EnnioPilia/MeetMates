import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { CguDialogComponent } from '../../../shared-components/cgu-dialog/cgu-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    AppInputComponent,
    AppButtonComponent,
    MatCheckboxModule
  ],
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  isSubmitting = false;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptCgu: [false, Validators.requiredTrue],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir tous les champs correctement.');
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.notification.showError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    const payload = {
      firstName: this.form.getRawValue().firstName,
      lastName: this.form.getRawValue().lastName,
      email: this.form.getRawValue().email,
      password: this.form.getRawValue().password,
      dateAcceptationCGU: new Date().toISOString(),
    };

    this.isSubmitting = true;

    this.authService
      .register(payload)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.notification.showSuccess('✅ Inscription réussie ! Vérifiez votre email pour activer votre compte.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('[Auth] Erreur inscription :', err);
          if (err.status === 409) {
            this.notification.showWarning('Cet email est déjà utilisé.');
          } else {
            this.notification.showError(err.error?.message || "❌ Erreur lors de l'inscription.");
          }
        },
      });
  }

  openCguDialog(event: Event) {
    event.preventDefault();
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
