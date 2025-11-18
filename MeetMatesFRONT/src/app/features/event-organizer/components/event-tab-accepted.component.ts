import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Participant } from '../../../core/models/participant.model';

@Component({
  selector: 'app-event-tab-accepted',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `

    <div class="max-h-[40vh] overflow-y-auto p-4">
      @if (filteredAcceptedParticipants.length > 0) {
        <div class="flex flex-col gap-1">
          @for (p of filteredAcceptedParticipants; track p.id) {
            <div class="flex justify-between items-center">              
              <span>{{ p.firstName }} {{ p.lastName }}</span>
              <button mat-icon-button color="warn"
                (click)="onReject(p.id)">
                <mat-icon>highlight_off</mat-icon>
              </button>
            </div>
          }
        </div>
      } @else {
        <p class="text-center text-gray-500 mt-4">
          Aucun participant accepté.
        </p>
      }
    </div>
  `,
})
export class EventTabAcceptedComponent {
  @Input() acceptedParticipants:  Participant[] = [];
  @Input() organizerName = '';
  @Output() reject = new EventEmitter<string>();

  get filteredAcceptedParticipants() {
    return this.acceptedParticipants.filter(
      p => `${p.firstName} ${p.lastName}`.trim() !== this.organizerName.trim()
    );
  }

  onReject(id: string) {
    this.reject.emit(id);
  }
  
  trackById(_: number, item: Participant) {
    return item.id;
  }
}
