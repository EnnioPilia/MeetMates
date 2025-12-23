// Angular
import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Core (services, models)
import { EventService } from '../../core/services/event/event.service';
import { EventMapperService } from '../../core/mappers/event-mapper';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventResponse } from '../../core/models/event-response.model';
import { EventListItem } from '../../core/models/event-list-item.model';

// Feature components
import { EventCardComponent } from '../../features/search-event/components/event-card-component';

// Shared components
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component';
import { AppInputComponent } from '../../shared-components/input/input.component';

/**
 * Composant parent chargé de la recherche d’événements.
 *
 * Responsabilités :
 * - gérer le formulaire de recherche (champ texte)
 * - déclencher la recherche d’événements avec un debounce
 * - transformer les réponses API en modèles d’affichage
 * - exposer les états de chargement et d’erreur à la vue
 * - gérer la navigation vers la page de détail d’un événement
 *
 * Fonctionnement :
 * - écoute les changements du champ `query`
 * - déclenche une recherche après un délai (`debounceTime`)
 * - annule les requêtes précédentes si une nouvelle saisie survient
 *
 * Architecture :
 * - `EventCardComponent` : affichage d’un événement dans la liste des résultats
 * - `EventInfoCardComponent` : présentation des informations détaillées
 */
@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppInputComponent,
    RouterModule,
    EventCardComponent,
    MatExpansionModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.scss'],
})
export class SearchEventsComponent implements OnInit {

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private mapper = inject(EventMapperService); 
  private destroyRef = inject(DestroyRef);

  /** Résultats de recherche transformés pour l’affichage */
  results = signal<EventListItem[]>([]);

  /** Indique si une recherche est en cours */
  loadingSearch = signal(false);

  /** État de chargement global */
  loading = signal(false);

  /** Message d’erreur éventuel */
  error = signal<string | null>(null);

  /** Formulaire de recherche */
  form: FormGroup = this.fb.group({
    query: [''],
  });

  /**
   * Initialise le composant.
   *
   * - écoute les changements du champ de recherche
   * - déclenche la recherche avec un debounce
   * - met à jour les résultats et les états associés
   */
  ngOnInit() {
    this.form.controls['query'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (!query?.trim()) {
            this.results.set([]);
            return of([] as EventResponse[]);
          }
          this.loadingSearch.set(true);
          return this.eventService.searchEvents(query.trim());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (responses: EventResponse[]) => {

          const mapped = this.mapper.toEventList(responses);
          
          this.results.set(mapped);
          this.loadingSearch.set(false);
          this.error.set(null);
        },
        error: () => {
          this.loadingSearch.set(false);
          this.error.set("Impossible de charger les événements.");
          this.notification.showError("Erreur lors de la recherche des événements.");
        }
      });
  }

  /** Redirige vers la page de détail d’un événement. */
  goToEventDetails(event: EventListItem) {
    this.router.navigate(['/events', event.activityId], {
      queryParams: { eventId: event.eventId }
    });
  }
}
