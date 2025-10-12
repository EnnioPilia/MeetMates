import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BackButtonComponent } from '../../../shared/components-material-angular/back-button/back-button.component'; // ✅ ici

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    BackButtonComponent
  ]
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  isSubmitting = false;

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.isSubmitting = true;

    const request = this.form.value;

    this.authService.register(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notification.showSuccess('✅ Inscription réussie ! Vérifiez votre email.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('[Auth] Erreur inscription :', err);

        if (err.status === 409) {
          this.notification.showWarning('Cet email est déjà utilisé.');
        } else {
          this.notification.showError(err.error?.message || "❌ Erreur lors de l'inscription.");
        }
      },
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
