
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../../core/services/signals/signals.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private signals: SignalsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.signals.setPageTitle('Accueil');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
    onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log("Utilisateur déconnecté");
        this.router.navigate(['/login']); // redirige vers la page de login
      },
      error: err => {
        console.error("Erreur lors de la déconnexion", err);
      }
    });
  }
}
