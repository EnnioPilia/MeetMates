import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventInfoCardComponent } from '../../../shared-components/event-info-card/event-info-card';
import { EventListItem } from '../../../core/models/event-list-item.model';

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
        <mat-expansion-panel-header>
          <div class="flex justify-between w-full mr-3">
            <span>{{ event.title }}</span>
            <span>{{ event.date | date: 'dd/MM/yy' }}</span>
          </div>
        </mat-expansion-panel-header>

        <div class="flex flex-col items-center justify-center w-full gap-2">

          <app-event-info-card 
            [event]="event">
          </app-event-info-card>

          <button 
            class="primary-button h-10 w-32" 
            (click)="emitDetails()">
            VOIR DÉTAILS
          </button>

        </div>
      </mat-expansion-panel>
  `,
})
export class EventCardComponent {

  @Input() event!: EventListItem;
  @Output() viewDetails = new EventEmitter<EventListItem>();

  emitDetails() {
    console.log("CLICK depuis EventCardComponent", this.event); // <--- IMPORTANT
    this.viewDetails.emit(this.event);
  }
}
