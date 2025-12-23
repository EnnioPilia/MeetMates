// Angular
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core (facades, service, models, mappers)
import { AddressSuggestion } from '../../core/services/address/address.service';
import { EventFacade } from '../../core/facades/events/event/event.facade';
import { EventFormMapper } from '../../core/mappers/event-form.mapper';
import { EventFormValue } from '../../core/models/event-form.model';

// Feature components
import { EventFormComponent } from '../event-form/event-form.component';

// Shared components
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

/**
 * Page de création d’un nouvel événement.
 *
 * Ce composant agit comme un conteneur orchestrationnel
 * autour de la feature `event-form`.
 *
 * Responsabilités :
 * - charger les données nécessaires à la création (activités, adresses)
 * - fournir les suggestions d’adresses au formulaire
 * - recevoir les valeurs du `EventFormComponent`
 * - transformer les données via `EventFormMapper`
 * - déléguer la création de l’événement à `EventFacade`
 *
 * Feature utilisée :
 * - `EventFormComponent` : formulaire d’événement réutilisable
 *   partagé entre la création et l’édition d’événement
 */
@Component({
  standalone: true,
  imports: [
    CommonModule, 
    EventFormComponent,
    StateHandlerComponent
  ],
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss']
})
export class PostEventPage {

  private eventFacade = inject(EventFacade);

  /** États exposés par la facade */
  activities = this.eventFacade.activities;
  addressSuggestions = this.eventFacade.addressSuggestions; 
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

  /**
   * Initialise la page.
   *
   * Déclenche le chargement des activités nécessaires à la création d’un événement.
   */
  ngOnInit() {
    this.eventFacade.loadActivities().subscribe();
  }

  /**
   * Lance une recherche d’adresses à partir de la saisie utilisateur.
   *
   * @param query Texte saisi dans le champ d’adresse
   */
  searchAddress(query: string) {
    this.eventFacade.searchAddress(query).subscribe();
  }

  /**
   * Gère la sélection d’une adresse depuis les suggestions.
   *
   * (Méthode prévue pour extension ou usage futur)
   *
   * @param address Adresse sélectionnée
   */
  selectAddress(address: AddressSuggestion) {}

  /**
   * Soumet la création d’un nouvel événement.
   *
   * - transforme les valeurs du formulaire
   * - délègue la création à la facade événement
   *
   * @param value Valeurs du formulaire d’événement
   */
  create(value: EventFormValue) {
    const request = EventFormMapper.toCreateRequest(value);
    this.eventFacade.createEvent(request).subscribe();
  }
}
