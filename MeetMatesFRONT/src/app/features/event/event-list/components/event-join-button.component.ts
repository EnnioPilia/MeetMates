import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from '../../../../core/models/event-response.model';
import { AppButtonComponent } from '../../../../shared-components/button/button.component';

@Component({
  selector: 'app-event-card-join-button',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  template: `

    <app-button
      label="P A R T I C I P E R"
      class="w-80 primary-button"
      [disabled]="!isEventOpen(event)"
      (clicked)="join.emit(event.id)">
    </app-button>
    
  `
})
export class EventCardJoinButtonComponent {
  @Input({ required: true }) event!: EventResponse;
  @Output() join = new EventEmitter<string>();

  isEventOpen(event: EventResponse): boolean {
    return (event.status ?? '').toUpperCase() === 'OPEN';
  }
}
