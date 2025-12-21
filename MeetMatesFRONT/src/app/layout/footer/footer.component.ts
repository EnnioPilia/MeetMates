// Angular
import { Component, inject  } from '@angular/core';
import { Router } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Composant de layout chargé de l’affichage
 * du pied de page de l’application.
 *
 * Responsabilités :
 * - afficher les actions de navigation globales
 * - déclencher la navigation via le router
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private router = inject(Router);

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
