import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event/event-service.service';
import { StatusColorPipe } from '../../../shared-components/pipes/statusColor.pipe'; // 
import { getStatusLabel, getParticipationLabel } from '../../../core/utils/labels.util';

@Component({
  selector: 'app-event-status',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  template: `
  
    <div class="flex flex-col items-center gap-2 border-b border-black mb-3 p-3">

      <p><strong>VOTRE PARTICIPATION :</strong><span [ngClass]="getParticipationLabel(participationStatus || '') | statusColor">
        {{ getParticipationLabel(participationStatus || '') }}</span></p> 
          
      <p><strong>STATUT DE L'ACTIVITÉ :</strong><span [ngClass]="getStatusLabel(eventStatus || '') | statusColor">
        {{ getStatusLabel(eventStatus || '') }}</span></p>
      
    </div>
  `
})
export class EventStatusComponent {
  private eventService = inject(EventService);

  @Input() eventStatus!: string | null;
  @Input() participationStatus!: string | null;


  getStatusLabel(status?: string): string {
     return status ? getStatusLabel(status) : '';
   }

 getParticipationLabel(status: string | null | undefined): string {
    return getParticipationLabel(status ?? null);
  }
}
