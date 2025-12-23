// Angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Shared components
import { StatusColorPipe } from '../../../shared-components/pipes/statusColor.pipe'; 
// Utils
import { getStatusLabel, getParticipationLabel } from '../../../core/utils/labels.utils';

/**
 * Sous-composant de présentation dédié à l’affichage
 * des statuts liés à l’événement et à la participation utilisateur.
 *
 * Responsabilités :
 * - afficher le statut de participation de l’utilisateur
 * - afficher le statut global de l’événement
 * - appliquer les couleurs via `StatusColorPipe`
 */
@Component({
  selector: 'app-event-status',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  template: `
  
    <div class="flex flex-col items-center gap-2 border-b border-black mb-3 p-3">

        <p><strong>VOTRE PARTICIPATION :</strong><span 
          [ngClass]="getParticipationLabel(participationStatus || '') | statusColor">
            {{ getParticipationLabel(participationStatus || '') }}</span>
        </p> 
            
        <p><strong>STATUT DE L'ACTIVITÉ :</strong><span 
          [ngClass]="getStatusLabel(eventStatus || '') | statusColor">
            {{ getStatusLabel(eventStatus || '') }}</span>
        </p>
      
    </div>
  `
})
export class EventStatusComponent {
  @Input() eventStatus!: string | null;
  @Input() participationStatus!: string | null;


  getStatusLabel(status?: string): string {
    return status ? getStatusLabel(status) : '';
  }

  getParticipationLabel(status: string | null | undefined): string {
    return getParticipationLabel(status ?? null);
  }
}
