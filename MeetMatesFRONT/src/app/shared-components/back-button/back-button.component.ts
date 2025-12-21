// Angular
import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Composant utilitaire fournissant un bouton de retour arrière.
 *
 * Comportement :
 * - retourne à la page précédente si l’historique navigateur le permet
 * - redirige vers une route de secours si aucun historique n’est disponible
 *
 * Utilisé dans les layouts ou pages nécessitant
 * une navigation de retour cohérente.
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './back-button.component.html',
})
export class BackButtonComponent {
  private location = inject(Location);
  private router = inject(Router);

  @Input() fallbackRoute: string = '/';

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([this.fallbackRoute]);
    }
  }
}
