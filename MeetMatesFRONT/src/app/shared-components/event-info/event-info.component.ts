import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../core/services/event/event-service.service';

interface EventData {
  status?: string;
  activityName?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  addressLabel?: string;
  level?: string;
  material?: string;
  maxParticipants?: number;
  organizerName?: string;
}

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoComponent {
  private readonly eventService = inject(EventService);

  @Input() event: EventData = {};
  @Input() showStatus = false;
  @Input() showOrganizer = true;

  getStatusLabel(status?: string): string {
    return status ? this.eventService.getStatusLabel(status) : '';
  }

  getLevelLabel(level?: string): string {
    return level ? this.eventService.getLevelLabel(level) : '';
  }

  getMaterialLabel(material?: string): string {
    return material ? this.eventService.getMaterialLabel(material) : '';
  }
  
  formatTime(time?: string): string {
    return time ? time.slice(0, 5) : '';
  }
}
