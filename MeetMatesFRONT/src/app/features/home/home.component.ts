// Angular
import { Component, ChangeDetectionStrategy, inject, computed  } from '@angular/core';
import { Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// Shared components
import { AppButtonComponent } from '../../../app/shared-components/button/button.component';

import { SignalsService } from '../../core/services/signals/signals.service';

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
  private signals = inject(SignalsService);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  readonly isAdmin = computed(() =>
    this.signals.currentUser()?.role === 'ADMIN'
  );

}
