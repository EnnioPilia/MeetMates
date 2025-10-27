import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../../core/services/event/event-service.service';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-participation-tab',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    RouterModule, 
    MatButtonModule,
    AppButtonComponent
  ],
  template: `

    <div class="max-h-[37vh] overflow-y-auto p-3">
      @if (events.length === 0) {
      <p class="text-center mt-4">Vous ne participez à aucun événement.</p>
      } @else {
      <mat-accordion multi class="flex flex-col gap-4 mt-2">
        @for (event of events; track event.id) {
        <mat-expansion-panel class="p-1 w-full">
          <mat-expansion-panel-header>
            <mat-panel-title>{{ event.eventTitle }}</mat-panel-title>
            <mat-panel-description>{{ event.eventDate | date: 'dd/MM/yy' }}</mat-panel-description>
          </mat-expansion-panel-header>

          <div class="flex flex-col gap-2">
            <p><strong>Status de l'activité:</strong> {{ getStatusLabel(event.eventStatus) }}</p>
            <p><strong>Votre participation :</strong> {{ getParticipationLabel(event.participationStatus) }}</p>
            <p>{{ event.addressLabel }}</p>
          </div>
          <div class="flex justify-end">
            <app-button label="Voir détails" class="primary-button-details w-20"[routerLink]="['/event-details', event.eventId]"></app-button>
          </div>
        </mat-expansion-panel>
        }
      </mat-accordion>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipationTabComponent {
  @Input() events: any[] = [];

  private eventService = inject(EventService);

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getParticipationLabel(status: string | null | undefined): string {
    return this.eventService.getParticipationLabel(status);
  }
}
