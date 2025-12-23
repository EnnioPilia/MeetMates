// Angular
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core (models)
import { EventDetails } from '../../core/models/event-details.model';

// Shared components
import { StatusColorPipe } from '../../shared-components/pipes/statusColor.pipe';

// Utils 
import { getStatusLabel as mapStatusLabel } from '../../core/utils/labels.utils';

/**
 * Carte compacte affichant les informations clés d’un événement.
 *
 * Responsabilités :
 * - afficher une version synthétique d’un événement
 * - gérer l’affichage conditionnel (statut, adresse, date, activité)
 *
 * Utilisée dans les listes, recherches et onglets profil.
 */
@Component({
  selector: 'app-event-info-card',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './event-info-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoCardComponent {
  
  @Input() event!: Partial<EventDetails>;

  @Input() showActivity = true;
  @Input() showStatus = true;
  @Input() showAddress = true;
  @Input() showDate = false;

  get status(): string | undefined {
    return this.event?.status;
  }

  get hasStatus(): boolean {
    return !!this.status;
  }

  get statusLabel(): string {
    return this.status ? mapStatusLabel(this.status) : '';
  }
}
