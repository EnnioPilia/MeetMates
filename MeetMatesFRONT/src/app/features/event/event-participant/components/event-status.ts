import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event/event-service.service';

@Component({
  selector: 'app-event-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center text-sm leading-relaxed mt-4 gap-2">
      <p><strong>STATUT DE L'ACTIVITÉ :</strong> {{ getStatusLabel(eventStatus || '') }}</p>
      <p><strong>VOTRE PARTICIPATION :</strong> {{ getParticipationLabel(participationStatus || '') }}</p>
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
