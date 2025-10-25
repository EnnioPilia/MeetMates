import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../../core/services/event/event-service.service';

@Component({
  selector: 'app-organization-tab',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, RouterModule, MatButtonModule],
  template: `
    <div class="max-h-[37vh] overflow-y-auto p-4">
      @if (events.length === 0) {
        <p class="text-center mt-4">Vous n'organisez aucun événement actuellement.</p>
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
              <p>{{ event.addressLabel }}</p>
              <p><strong>Activité : </strong> {{ event.activityName }}</p>
            </div>
              <div class="flex justify-end">
                <button mat-flat-button class="primary-button-details" [routerLink]="['/event-organizer', event.eventId]">
                  Voir détails
                </button>
              </div>
            </mat-expansion-panel>
          }
        </mat-accordion>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationTabComponent {
  @Input() events: any[] = [];

  private eventService = inject(EventService);

  getStatusLabel(status: string) {
    return this.eventService.getStatusLabel(status);
  }

}
