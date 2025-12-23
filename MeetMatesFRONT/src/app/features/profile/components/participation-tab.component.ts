// Angular
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

// Core (services, models)
import { EventMapperService } from '../../../core/mappers/event-mapper';
import { EventListItem } from '../../../core/models/event-list-item.model';
import { EventResponse } from '../../../core/models/event-response.model';

// Shared components
import { StatusColorPipe } from '../../../shared-components/pipes/statusColor.pipe';

// Utils
import { getStatusLabel, getParticipationLabel } from '../../../core/utils/labels.utils';


/**
 * Sous-composant dédié à l’affichage des événements
 * auxquels l’utilisateur participe.
 *
 * Responsabilités :
 * - afficher la liste des événements de participation
 * - présenter le statut de l’événement
 * - présenter le statut de participation de l’utilisateur
 * - fournir un accès à la page de détail participant
 */
@Component({
  selector: 'app-participation-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule, 
    RouterModule, 
    MatButtonModule, 
    StatusColorPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="max-h-[35vh] overflow-y-auto mt-2 p-1">
      @if (mappedEvents.length === 0) {
        <p class="text-center text-gray-500 mt-4">
          Vous ne participez à aucun événement actuellement.
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
              <div class="flex flex-col gap-2">
                <p><strong>Status de l'activité :</strong>
                  <span [ngClass]="getStatusLabel(event.status) | statusColor">
                    {{ getStatusLabel(event.status) }}
                  </span>
                </p>
                <p><strong>Votre participation :</strong>
                  <span [ngClass]="getParticipationLabel(event.participationStatus) | statusColor">
                    {{ getParticipationLabel(event.participationStatus) }}
                  </span>
                </p>

                  <p>{{ event.addressLabel }}</p>
                    
                  <button 
                    class="primary-button h-10" 
                    [routerLink]="['/event-participant', event.eventId]">
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
export class ParticipationTabComponent {
  private mapper = inject(EventMapperService);
  
  @Input() events: EventResponse[] = [];

  get mappedEvents(): EventListItem[] {
    return this.mapper.toEventList(this.events);
  }

  getStatusLabel(status?: string): string {
    return status ? getStatusLabel(status) : '';
  }

  getParticipationLabel(status?: string | null): string {
    return getParticipationLabel(status ?? null);
  }
}
