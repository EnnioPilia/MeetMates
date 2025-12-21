// Angular
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';

/**
 * Composant de présentation affichant l’en-tête d’un événement.
 *
 * Responsabilités :
 * - afficher le titre et la description de l’événement
 * - exposer une action d’annulation (bouton retour / quitter)
 *
 * Utilisé dans les pages événement participant / organisateur.
 */
@Component({
  selector: 'app-event-header',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule
  ],
  templateUrl: './event-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventHeaderComponent {
  @Input() title = '';
  @Input() description = '';
  @Output() cancel = new EventEmitter<void>();
}
