import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetails } from '../../core/models/event-details.model';
import { StatusColorPipe } from '../../shared-components/pipes/statusColor.pipe';
import { getStatusLabel as mapStatusLabel } from '../../core/utils/labels.util';

@Component({
  selector: 'app-event-info-card',
  standalone: true,
  imports: [CommonModule,StatusColorPipe],
  templateUrl: './event-info-card.html',
})
export class EventInfoCardComponent {
  @Input() event!: EventDetails;
  @Input() showActivity = true;
  @Input() showStatus = true;
  @Input() showAddress = true;
  @Input() showDate = false;

  getStatusLabel(status?: string): string {
    return status ? mapStatusLabel(status) : '';
  }

  getStatus(event: any): string | undefined {
    return event.status || event.eventStatus;
  }
}
