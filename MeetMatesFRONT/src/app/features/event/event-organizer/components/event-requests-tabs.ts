import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-requests-tabs',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
  
    <mat-tab-group class="w-full max-w-none mb-4" mat-align-tabs="start" animationDuration="300ms">
      <mat-tab>
        <ng-template mat-tab-label>Acceptés</ng-template>
        <div class="max-h-[40vh] overflow-y-auto p-4">
          @if (acceptedParticipants.length > 0) {
          <div class="flex flex-col">
            @for (p of acceptedParticipants; track p.id) {
            <div class="flex justify-between items-center">
              <span>{{ p.firstName }} {{ p.lastName }}</span>

              <button *ngIf="(p.firstName + ' ' + p.lastName) !== organizerName" mat-icon-button color="warn"
                (click)="onReject(p.id)" aria-label="Refuser">
                <mat-icon>highlight_off</mat-icon>
              </button>
            </div>
            }
          </div>
          } @else {
          <p class="text-center text-gray-500 mt-4">
            Aucun participant accepté pour le moment.
          </p>
          }
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>En attente</ng-template>
        <div class="p-4">
          @if (pendingParticipants.length > 0) {
          <div class="flex flex-col gap-2">
            @for (p of pendingParticipants; track p.id) {
            <div class="flex justify-between items-center">
              <span>{{ p.firstName }} {{ p.lastName }}</span>

              <div class="flex gap-1">
                <button mat-icon-button color="primary" (click)="onAccept(p.id)" aria-label="Accepter">
                  <mat-icon>check</mat-icon>
                </button>

                <button mat-icon-button color="warn" (click)="onReject(p.id)" aria-label="Refuser">
                  <mat-icon>highlight_off</mat-icon>
                </button>
              </div>
            </div>
            }
          </div>
          } @else {
          <p class="text-center text-gray-500 mt-4">
            Aucun participant en attente.
          </p>
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class EventRequestsTabsComponent {
  @Input() acceptedParticipants: { id: string; firstName: string; lastName: string }[] = [];
  @Input() pendingParticipants: { id: string; firstName: string; lastName: string }[] = [];
  @Input() organizerName = '';

  @Output() accept = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  onAccept(id: string) {
    this.accept.emit(id);
  }

  onReject(id: string) {
    this.reject.emit(id);
  }

  onRemove(id: string) {
    this.remove.emit(id);
  }
}
