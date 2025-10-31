import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventInfoComponent } from '../../../../shared-components/event-info/event-info.component';
import { EventDetails } from '../../../../core/models/event-details.model';
import { AppButtonComponent } from '../../../../shared-components/button/button.component';

@Component({
  selector: 'app-event-organizer-info',
  standalone: true,
  imports: [CommonModule, EventInfoComponent],
  template: `

    <div class="flex flex-col items-center gap-4 w-full">
      <app-event-info
        [event]="event"
        [showStatus]="true"
        [showOrganizer]="false">
      </app-event-info>
    </div>
  `
})
export class EventOrganizerInfoComponent {
  @Input() event!: EventDetails;
}