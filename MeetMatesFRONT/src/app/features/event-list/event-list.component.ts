// Angular
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, inject, ElementRef, QueryList, ViewChildren, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Core (facades, services)
import { EventListFacade } from '../../core/facades/events/event-list/event-list.facade';
import { EventResponse } from '../../core/models/event-response.model';

// Shared components
import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

// Utils
import { getStatusLabel, getLevelLabel, getMaterialLabel } from '../../core/utils/labels.utils';

/**
 * Composant parent chargé de l’affichage et de l’interaction
 * avec la liste des événements.
 *
 * Responsabilités :
 * - charger les événements selon le contexte :
 *   - tous les événements
 *   - ou filtrés par activité
 * - charger les informations utilisateur nécessaires aux actions
 * - exposer les états (données, chargement, erreur) à la vue
 * - permettre l’inscription à un événement
 * - gérer le scroll automatique vers un événement ciblé
 * 
 * Architecture :
 * - compose exclusivement des composants partagés (`shared-components`)
 * 
 * Le composant s’appuie sur `EventListFacade`
 * pour la récupération des données et les actions métier.
 */
@Component({
  selector: 'app-event-list',
  standalone: true,
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    EventHeaderComponent,
    EventInfoComponent,
    AppButtonComponent,
    StateHandlerComponent
  ]
})
export class EventListComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private eventListFacade = inject(EventListFacade);
  private destroyRef = inject(DestroyRef);

  /** États exposés par la facade */
  readonly events = this.eventListFacade.events;
  readonly loading = this.eventListFacade.loading;
  readonly error = this.eventListFacade.error;

  /** Références DOM des cartes événement, utilisées pour le scroll ciblé */
  @ViewChildren('eventCard') eventCards!: QueryList<ElementRef>;

  /**
    * Initialise le composant.
    *
    * - charge l’utilisateur courant
    * - charge les événements selon la route (activité ou global)
    * - écoute les paramètres de requête pour déclencher un scroll ciblé
    */
  ngOnInit(): void {
    this.eventListFacade.loadCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {

        const activityId = this.route.snapshot.paramMap.get('activityId');

        if (activityId) {
          this.eventListFacade.loadActivityName(activityId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();

          this.eventListFacade.loadEventsByActivity(activityId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        } else {
          this.eventListFacade.loadAllEvents()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const eventId = params['eventId'];
        if (eventId) this.scrollToEventWhenReady(eventId);
      });
  }

  /**
   * Inscrit l’utilisateur courant à un événement.
   *
   * @param eventId Identifiant de l’événement
   */
  joinEvent(eventId: string) {
    this.eventListFacade.joinEvent(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /** Attend la disponibilité du DOM et des données avant d’effectuer un scroll programmatique. */
  private scrollToEventWhenReady(eventId: string) {
    const checkLoaded = setInterval(() => {
      if (!this.loading() && this.eventCards?.length > 0) {
        this.scrollToEvent(eventId);
        clearInterval(checkLoaded);
      }
    }, 200);
  }

  /** Effectue un scroll vers une carte événement et applique un effet visuel temporaire. */
  private scrollToEvent(eventId: string) {
    const card = this.eventCards.find(el =>
      el.nativeElement.getAttribute('data-id') === eventId
    );

    if (card) {
      card.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      card.nativeElement.classList.add('highlight');
      setTimeout(() => card.nativeElement.classList.remove('highlight'), 2000);
    }
  }

  /** Fonctions utilitaires de présentation (aucune logique métier). */
  getStatusLabel(status?: string) { return status ? getStatusLabel(status) : ''; }
  getLevelLabel(level?: string) { return level ? getLevelLabel(level) : ''; }
  getMaterialLabel(material?: string) { return material ? getMaterialLabel(material) : ''; }
  formatTime(time: string): string { return time ? time.substring(0, 5) : ''; }

  /** Indique si un événement est ouvert à l’inscription. */
  isEventOpen(event: EventResponse): boolean {
    return (event.status ?? '').toUpperCase() === 'OPEN';
  }
}
