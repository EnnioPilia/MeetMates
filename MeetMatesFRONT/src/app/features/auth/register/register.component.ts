import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
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
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptCgu: [false, Validators.requiredTrue],
  });
  
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

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

    this.authFacade
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // success = null si erreur → rien à gérer
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
