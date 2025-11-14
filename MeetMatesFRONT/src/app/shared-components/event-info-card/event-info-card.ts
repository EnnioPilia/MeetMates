import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetails } from '../../core/models/event-details.model';
import { EventService } from '../../core/services/event/event-service.service';
import { StatusColorPipe } from '../../shared-components/pipes/statusColor.pipe';

@Component({
  selector: 'app-event-info-card',
  standalone: true,
  imports: [CommonModule,StatusColorPipe],
  templateUrl: './event-info-card.html',
})
export class EventInfoCardComponent {
  private eventService = inject(EventService);

  @Input() event!: EventDetails;
  @Input() showActivity = true;
  @Input() showStatus = true;
  @Input() showAddress = true;
  @Input() showDate = false;

  getStatusLabel(status?: string): string {
    return status ? this.eventService.getStatusLabel(status) : '';
  }

  getStatus(event: any): string | undefined {
    return event.status || event.eventStatus;
  }
}
