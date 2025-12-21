// Angular
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core (models)
import { EventDetails } from '../../core/models/event-details.model';
import { EventResponse } from '../../core/models/event-response.model';

// Shared components
import { StatusColorPipe } from '../pipes/statusColor.pipe';

// Utils 
import { getStatusLabel, getLevelLabel, getMaterialLabel } from '../../core/utils/labels.util';

/**
 * Composant de présentation des informations détaillées d’un événement.
 *
 * Responsabilités :
 * - afficher les informations principales (date, heure, niveau, matériel)
 * - formater les labels via les utilitaires de mapping
 * - adapter l’affichage selon le contexte (statut, organisateur)
 *
 * Supporte `EventResponse` et `EventDetails`.
 */
@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './event-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoComponent {
  @Input() event!: EventResponse | EventDetails;
  @Input() showStatus = false;
  @Input() showOrganizer = true;

  get statusLabel(): string {
    return this.event.status ? getStatusLabel(this.event.status) : '';
  }

  get levelLabel(): string {
    return this.event.level ? getLevelLabel(this.event.level) : '';
  }

  get materialLabel(): string {
    return this.event.material ? getMaterialLabel(this.event.material) : '';
  }

  get eventDate(): string {
    return this.event.eventDate ?? '';
  }

  get eventTime(): string {
    const start = this.event.startTime?.slice(0, 5);
    const end = this.event.endTime?.slice(0, 5);
    return `${start} - ${end}`;
  }
}

