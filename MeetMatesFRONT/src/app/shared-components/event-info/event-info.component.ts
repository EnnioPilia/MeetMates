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

  getStatusLabel(status?: string): string {
    return status ? getStatusLabel(status) : '';
  }

  getLevelLabel(level?: string): string {
    return level ? getLevelLabel(level) : '';
  }

  getMaterialLabel(material?: string): string {
    return material ? getMaterialLabel(material) : '';
  }

  formatTime(time?: string): string {
    return time?.slice(0, 5) ?? '';
  }
}
