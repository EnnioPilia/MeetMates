import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventDetails } from '../../../core/models/event-details.model';
import { EventService } from '../../../core/services/event/event-service.service';
import { EventInfoCardComponent } from '../../../shared-components/event-info-card/event-info-card';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    EventInfoCardComponent
  ],
  template: `

      <mat-expansion-panel class="w-full flex flex-col justify-center">
        <mat-expansion-panel-header >
          <div class="flex justify-between w-full mr-3">
            <span>{{ event.title }}</span>
            <span>{{ event.eventDate | date: 'dd/MM/yy' }}</span>
          </div>
        </mat-expansion-panel-header>

        <div class="flex flex-col items-center justify-center w-full gap-2">

          <app-event-info-card 
            [event]="event">
          </app-event-info-card>

          <button 
            class="primary-button h-10 w-32" 
            (click)="onViewDetails(event)">
            VOIR DÉTAILS 
          </button>

        </div>
      </mat-expansion-panel>

  `,
})
export class EventCardComponent {
  @Input() onViewDetails!: (event: EventDetails) => void;
  @Input() event!: EventDetails;
  @Input() events: any[] = [];

  private eventService = inject(EventService);

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getParticipationLabel(status: string | null | undefined): string {
    return this.eventService.getParticipationLabel(status);
  }
}
