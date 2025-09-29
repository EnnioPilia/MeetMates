import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SignalsService } from '../../core/services/signals/signals.service';
import { AuthService } from '../../core/services/auth/auth.service'; // <-- ajoute ton service d'auth

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  signals = inject(SignalsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Utilisateur déconnecté');
        this.router.navigate(['/login']); // redirige vers la page de login
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
      },
    });
  }
}
