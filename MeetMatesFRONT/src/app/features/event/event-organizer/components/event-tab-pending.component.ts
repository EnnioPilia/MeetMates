import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-tab-pending',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `

    <div class="max-h-[40vh] overflow-y-auto">
      @if (pendingParticipants.length > 0) {
        <div class="flex flex-col justify-between gap-2 p-2">
          @for (p of pendingParticipants; track p.id) {
            <div class="flex justify-between items-center">
              <span>{{ p.firstName }} {{ p.lastName }}</span>

              <div class="flex">
                <button mat-icon-button color="primary" 
                  (click)="accept.emit(p.id)" aria-label="Accept participant">
                  <mat-icon>check</mat-icon>
                </button>

                <button mat-icon-button color="warn" 
                  (click)="reject.emit(p.id)" aria-label="Reject participant">
                  <mat-icon>highlight_off</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <p class="text-center text-gray-500 mt-4 p-4">
            Aucun participant en attente.
        </p>
      }
    </div>
  `,
})
export class EventTabPendingComponent {
  @Input() pendingParticipants: { id: string; firstName: string; lastName: string }[] = [];
  @Output() accept = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
}
