import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../../core/services/event/event-service.service';

@Component({
  selector: 'app-participation-tab',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    RouterModule, 
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="max-h-[35vh] overflow-y-auto mt-2 p-1">
      @if (events.length === 0) {
      <p class="text-center text-gray-500 mt-4">Vous ne participez à aucun événement actuellement.</p>
      } @else {
      <mat-accordion multi class="flex flex-col gap-4">
        @for (event of events; track event.id) {
        <mat-expansion-panel class=" w-full">
          <mat-expansion-panel-header class="items-start">
            <div class="flex justify-between w-full items-start mr-3">
              <span>{{ event.eventTitle }}</span>
              <span>{{ event.eventDate | date: 'dd/MM/yy' }}</span>
            </div>
          </mat-expansion-panel-header>

          <div class="flex flex-col gap-2">
            <p><strong>Status de l'activité:</strong> {{ getStatusLabel(event.eventStatus) }}</p>
            <p><strong>Votre participation :</strong> {{ getParticipationLabel(event.participationStatus) }}</p>
            <p>{{ event.addressLabel }}</p>
            <button class="primary-button h-10" [routerLink]="['/event-details', event.eventId]">Voir détails</button>
          </div>
        </mat-expansion-panel>
        }
      </mat-accordion>
      }
    </div>
  `,
})
export class ParticipationTabComponent {
  private eventService = inject(EventService);

  @Input() events: any[] = [];

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getParticipationLabel(status: string | null | undefined): string {
    return this.eventService.getParticipationLabel(status);
  }
}
