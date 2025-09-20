import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service'; // adapte le chemin
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedButtonComponent } from '../../shared/components/shared-button/shared-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Erreur de déconnexion :', err)
    });
  }
  // goToProfile() {
  //   this.router.navigate(['/profile']);
  // }
  // goToHome(): void {
  //   this.router.navigate(['/home']); // ou '/' selon ta route d'accueil
  // }
    navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
