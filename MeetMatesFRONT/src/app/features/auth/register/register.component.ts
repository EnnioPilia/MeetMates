import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler/error-handler.service';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { CguDialogComponent } from '../../../shared-components/cgu-dialog/cgu-dialog.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  isSubmitting = false;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptCgu: [false, Validators.requiredTrue],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir tous les champs correctement.');
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.notification.showError('❌ Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      firstName: this.form.getRawValue().firstName,
      lastName: this.form.getRawValue().lastName,
      email: this.form.getRawValue().email.trim().toLowerCase(),
      password,
      dateAcceptationCGU: new Date().toISOString(),
    };

    this.isSubmitting = true;

    this.authService
      .register(payload)
      .pipe(
        catchError((err) => {
          this.errorHandler.handle(err);
          this.cdr.markForCheck();
          return EMPTY;
        }),
        finalize(() => (this.isSubmitting = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.notification.showSuccess('✅ Inscription réussie ! Vérifiez votre email pour activer votre compte.');
        this.router.navigate(['/login']);
        this.cdr.markForCheck();
      });
  }

  openCguDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
