// Angular
import { Component, Input, Signal } from '@angular/core';

// Shared components
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

/**
 * Composant utilitaire de gestion d’état asynchrone.
 *
 * Responsabilités :
 * - afficher un spinner lors du chargement
 * - afficher un message d’erreur si présent
 * - déléguer l’affichage du contenu au parent
 *
 * Conçu pour fonctionner avec des `Signal`.
 */
@Component({
  selector: 'app-state-handler',
  standalone: true,
  imports: [ LoadingSpinnerComponent],
  templateUrl: './state-handler.component.html'
})

export class StateHandlerComponent {
  @Input() loading!: Signal<boolean>;
  @Input() error!: Signal<string | null>;
}
