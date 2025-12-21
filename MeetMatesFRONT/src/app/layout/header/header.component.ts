// Angular
import { Component, inject } from '@angular/core';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Core (services)
import { SignalsService } from '../../core/services/signals/signals.service';

// Shared components
import { BackButtonComponent } from '../../shared-components/back-button/back-button.component';

/**
 * Composant de layout chargé de l’en-tête global
 * de l’application.
 *
 * Responsabilités :
 * - afficher la barre de navigation principale
 * - exposer les signaux globaux à la vue
 * - intégrer les actions transverses (retour, menus)
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDialogModule,
    BackButtonComponent]
    ,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  signals = inject(SignalsService);
}
