import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventHeaderComponent } from '../../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../../shared-components/event-info/event-info.component';
import { EventPictureComponent } from '../../../../shared-components/event-picture/event-picture.component';
import { EventDetails } from '../../../../core/models/event-details.model';
import { AppButtonComponent } from '../../../../shared-components/button/button.component';

@Component({
  selector: 'app-event-organizer-info',
  standalone: true,
  imports: [CommonModule, EventPictureComponent, EventInfoComponent,AppButtonComponent],
  template: `

    <div class="flex flex-col items-center gap-4 w-full">
      <app-event-info
        [event]="event"
        [showStatus]="true"
        [showOrganizer]="false">
      </app-event-info>

      <app-event-picture
        [imageUrl]="event.imageUrl"
        [title]="event.title"
        [width]="280"
        [height]="130">
      </app-event-picture>

      <app-button
        label="ALLER À LA CONVERSATION" 
        class="w-80 primary-button"
        [routerLink]="['/conversation',event.id]">
      </app-button>
    </div>
  `
})
export class EventOrganizerInfoComponent {
  @Input() event!: EventDetails;
}