import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from '../../../../core/models/event-response.model';
import { EventHeaderComponent } from '../../../../shared-components/event-header/event-header.component';
import { EventPictureComponent } from '../../../../shared-components/event-picture/event-picture.component';
import { EventInfoComponent } from '../../../../shared-components/event-info/event-info.component';

@Component({
  selector: 'app-event-card-info',
  standalone: true,
  imports: [
    CommonModule,
    EventHeaderComponent,
    EventPictureComponent,
    EventInfoComponent,
  ],
  template: `
  
    <div class="flex flex-col items-center w-full">
      <app-event-header
        [title]="event.title"
        [description]="event.description">
      </app-event-header>

      <app-event-picture
        [imageUrl]="event.imageUrl"
        [title]="event.title"
        [width]="290"
        [height]="130">
      </app-event-picture>

      <app-event-info
        [event]="event"
        [showStatus]="true">
      </app-event-info>
    </div>
  `
})
export class EventCardInfoComponent {
  @Input() event!: EventResponse;
}
