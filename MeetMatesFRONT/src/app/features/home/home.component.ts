// Angular
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// Shared components
import { AppButtonComponent } from '../../../app/shared-components/button/button.component';

/**
 * Composant de page d’accueil de l’application.
 *
 * Responsabilités :
 * - présenter l’entrée principale de l’application
 * - proposer des actions de navigation vers les fonctionnalités clés
 */
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, AppButtonComponent],
})
export class HomeComponent {
  private router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
