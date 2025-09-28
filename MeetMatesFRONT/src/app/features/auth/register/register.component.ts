import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
    // private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;

      // 👉 Exemple si tu as un service d'auth
      // this.authService.register(name, email, password).subscribe({
      //   next: () => this.router.navigate(['/home']),
      //   error: err => console.error(err)
      // });

      console.log('✅ Register form submitted:', { name, email, password });
      this.router.navigate(['/home']); // redirection après succès
    } else {
      console.log('⚠️ Formulaire invalide');
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
