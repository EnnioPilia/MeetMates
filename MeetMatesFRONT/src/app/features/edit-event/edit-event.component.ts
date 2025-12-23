// Angular
import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Core (facades, models, mappers)
import { EditEventFacade } from '../../core/facades/events/edit-event/edit-event.facade';
import { EventFormMapper } from '../../core/mappers/event-form.mapper';
import { EventFormValue } from '../../core/models/event-form.model';

// Feature components
import { EventFormComponent } from '../event-form/event-form.component';

// Shared components
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

/**
 * Page d’édition d’un événement existant.
 *
 * Cette page agit comme un conteneur orchestrationnel
 * autour de la feature `event-form`.
 *
 * Responsabilités :
 * - charger l’événement à partir de l’URL
 * - fournir les données initiales au `EventFormComponent`
 * - recevoir et transformer les valeurs du formulaire
 * - déclencher la mise à jour de l’événement
 *
 * Feature utilisée :
 * - `EventFormComponent` : formulaire réutilisable
 *   partagé entre création et édition d’événement
 */
@Component({
  standalone: true,
  imports: [
    CommonModule, 
    EventFormComponent, 
    StateHandlerComponent
  ],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventPage implements OnInit {

  private facade = inject(EditEventFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** États exposés par la facade */
  event = this.facade.event;
  activities = this.facade.activities;
  addressSuggestions = this.facade.addressSuggestions;
  loading = this.facade.loading;
  error = this.facade.error;

  /**
   * Données du formulaire dérivées de l’événement courant.
   * Le mapping est recalculé automatiquement lorsque l’événement change.
   */
  formData = computed<Partial<EventFormValue> | null>(() => {
    const e = this.event();
    return e ? EventFormMapper.toFormValue(e) : null;
  });

  /**
   * Initialise la page :
   * - récupère l’ID depuis l’URL
   * - déclenche le chargement de l’événement
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.facade.loadEvent(id).subscribe();
  }

  /**
   * Soumet la mise à jour de l’événement.
   *
   * @param value Valeurs du formulaire
   */
  update(value: EventFormValue) {
    const current = this.event();
    if (!current) return;

    const request = EventFormMapper.toUpdateRequest(value, current.status);

    this.facade.updateEvent(current.id, request).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      }
    });
  }

  /**
   * Lance une recherche d’adresses pour l’autocomplétion.
   *
   * @param query Texte saisi par l’utilisateur
   */
  searchAddress(query: string) {
    this.facade.getAddressSuggestions(query).subscribe();
  }
}
