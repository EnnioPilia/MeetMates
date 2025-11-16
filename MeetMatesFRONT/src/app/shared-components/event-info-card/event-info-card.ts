import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetails } from '../../core/models/event-details.model';
import { StatusColorPipe } from '../../shared-components/pipes/statusColor.pipe';
import { getStatusLabel as mapStatusLabel } from '../../core/utils/labels.util';

@Component({
  selector: 'app-event-info-card',
  standalone: true,
  imports: [CommonModule, StatusColorPipe],
  templateUrl: './event-info-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInfoCardComponent {
  
  @Input() event!: Partial<EventDetails>;

  @Input() showActivity = true;
  @Input() showStatus = true;
  @Input() showAddress = true;
  @Input() showDate = false;

  get status(): string | undefined {
    return this.event?.status;
  }

  get hasStatus(): boolean {
    return !!this.status;
  }

  get statusLabel(): string {
    return this.status ? mapStatusLabel(this.status) : '';
  }
}
