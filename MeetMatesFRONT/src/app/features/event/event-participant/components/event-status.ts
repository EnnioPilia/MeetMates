import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event/event-service.service';

@Component({
  selector: 'app-event-status',
  standalone: true,
  imports: [CommonModule],
  template: `
  
    <div class="flex flex-col items-center gap-2 border-b border-black mb-3 p-3">

      <p><strong>VOTRE PARTICIPATION :</strong> {{ getParticipationLabel(participationStatus || '') }}</p>
      <p><strong>STATUT DE L'ACTIVITÉ :</strong> {{ getStatusLabel(eventStatus || '') }}</p>
      
    </div>
  `
})
export class EventStatusComponent {
  private eventService = inject(EventService);

  @Input() eventStatus!: string | null;
  @Input() participationStatus!: string | null;

  getStatusLabel(status: string) {
    return this.eventService.getStatusLabel(status);
  }

  getParticipationLabel(status: string | null) {
    return this.eventService.getParticipationLabel(status);
  }
}
