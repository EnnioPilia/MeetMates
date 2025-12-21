// Angular
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';

// Core (services, models)
import { EventMapperService } from '../../../core/services/event/event-mapper.service';
import { EventListItem } from '../../../core/models/event-list-item.model';
import { EventResponse } from '../../../core/models/event-response.model';

// Shared components
import { EventInfoCardComponent } from '../../../shared-components/event-info-card/event-info-card';

/**
 * Sous-composant dédié à l’affichage des événements
 * organisés par l’utilisateur.
 *
 * Responsabilités :
 * - afficher la liste des événements organisés
 * - permettre l’accès à la page organisateur
 */
@Component({
  selector: 'app-organization-tab',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    RouterModule, 
    MatButtonModule, 
    EventInfoCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="max-h-[35vh] overflow-y-auto mt-2 p-1">
      @if (mappedEvents.length === 0) {
        <p class="text-center text-gray-500 mt-4">
          Vous n'organisez aucun événement actuellement.
        </p>
      } @else {
        <mat-accordion multi class="flex flex-col gap-4">
          @for (event of mappedEvents; track event.id) {
            <mat-expansion-panel class="w-full">
              <mat-expansion-panel-header class="items-start">
                <div class="flex justify-between w-full items-start mr-3">
                  <span class="text-xl">{{ event.title }}</span>
                  <span class="mt-1">{{ event.date | date: 'dd/MM/yy' }}</span>
                </div>
              </mat-expansion-panel-header>
              <div class="flex flex-col">
                <app-event-info-card [event]="event"></app-event-info-card>
                <button class="primary-button h-10" [routerLink]="['/event-organizer', event.eventId]">
                  VOIR DÉTAILS
                </button>
              </div>
            </mat-expansion-panel>
          }
        </mat-accordion>
      }
    </div>
  `
})
export class OrganizationTabComponent {
  private mapper = inject(EventMapperService);

  @Input() events: EventResponse[] = [];

  get mappedEvents(): EventListItem[] {
    return this.mapper.toEventList(this.events);
  }
}