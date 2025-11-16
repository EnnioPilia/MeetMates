import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColorPipe } from '../pipes/statusColor.pipe';
import { getStatusLabel, getLevelLabel, getMaterialLabel } from '../../core/utils/labels.util';

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
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './event-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoComponent {

  @Input() event: EventData = {};
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

