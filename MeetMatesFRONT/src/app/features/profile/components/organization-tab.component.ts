import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { EventService } from '../../../core/services/event/event-service.service';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-organization-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule, 
    RouterModule, 
    MatButtonModule,
    AppButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="max-h-[35vh] overflow-y-auto mt-2 p-1">
      @if (events.length === 0) {
      <p class="text-center mt-4">Vous n'organisez aucun événement actuellement.</p>
      } @else {
      <mat-accordion multi class="flex flex-col gap-4">
        @for (event of events; track event.id) {
        <mat-expansion-panel class="w-full">
          <mat-expansion-panel-header class="items-start">
            <div class="flex justify-between w-full items-start mr-3">
              <span>{{ event.eventTitle }}</span>
              <span>{{ event.eventDate | date: 'dd/MM/yy' }}</span>
            </div>
          </mat-expansion-panel-header>

          <div class="flex flex-col gap-2">

            <p><strong>Status de l'activité:</strong> {{ getStatusLabel(event.eventStatus) }}</p>
            <p><strong>{{ event.addressLabel }}</strong> </p>
            <p><strong>Activité :</strong> {{ event.activityName }}</p>
       
            <!-- <app-button label="Voir détails" class="primary-button-details w-20"[routerLink]="['/event-organizer', event.eventId]"></app-button> -->
             <button class="primary-button h-10" [routerLink]="['/event-organizer', event.eventId]">Voir détails</button>

          </div>
        </mat-expansion-panel>
        }
      </mat-accordion>
      }
    </div>
  `,
})
export class OrganizationTabComponent {
  private eventService = inject(EventService);

  @Input() events: any[] = [];

  getStatusLabel(status: string) {
    return this.eventService.getStatusLabel(status);
  }
}
