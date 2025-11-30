import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { MatCardModule } from '@angular/material/card';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authFacade = inject(AuthFacade);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }
  
  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();

    this.authFacade
      .login(email.trim().toLowerCase(), password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success) => {
        // success = null si erreur, pas besoin de gérer
        this.cdr.markForCheck();
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
