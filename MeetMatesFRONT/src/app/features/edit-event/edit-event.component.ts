// Angular
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Core (facades, services)
import { EditEventFacade } from '../../core/facades/events/edit-event/edit-event.facade';
import { AddressSuggestion } from '../../core/services/address/address.service';

// Feature components
import { EditEventInfoComponent } from './components/edit-event-info.component';
import { EditEventDetailsComponent } from './components/edit-event-details.component';
import { EditEventAddressComponent } from './components/edit-event-address.component';
import { EditEventDateTimeComponent } from './components/edit-event-dateTime.component';
import { EditEventActivityComponent } from './components/edit-event-activity.component';

// Shared components
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

// Utils
import { parseLocalDate, formatLocalDate } from '../../core/utils/date.utils';

/**
 * Composant parent chargé de l’édition d’un événement existant.
 *
 * Responsabilités :
 * - récupérer l’identifiant de l’événement depuis la route
 * - orchestrer le chargement des données via `EditEventFacade`
 * - initialiser et porter le formulaire racine d’édition
 * - distribuer les sous-parties du formulaire aux composants enfants
 * - agréger et soumettre les modifications de l’événement
 * 
 * Architecture :
 * - `EditEventInfoComponent` : informations générales et statut
 * - `EditEventDetailsComponent` : niveau, matériel et options avancées
 * - `EditEventAddressComponent` : saisie et sélection de l’adresse
 * - `EditEventDateTimeComponent` : date et horaires de l’événement
 * - `EditEventActivityComponent` : activité associée et participants
 */
@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    EditEventInfoComponent,
    EditEventDetailsComponent,
    EditEventAddressComponent,
    EditEventDateTimeComponent,
    EditEventActivityComponent,
    AppButtonComponent,
    StateHandlerComponent
  ],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private editEventFacade = inject(EditEventFacade);
  private destroyRef = inject(DestroyRef);

  /** États exposés par la facade */
  readonly loading = this.editEventFacade.loading;
  readonly error = this.editEventFacade.error;
  readonly activities = this.editEventFacade.activities;
  readonly event = this.editEventFacade.event;
  readonly addressSuggestions = this.editEventFacade.addressSuggestions;

  /** Formulaire racine d’édition de l’événement */
  form!: FormGroup;

  /** Identifiant de l’événement en cours d’édition */
  eventId!: string;

  /**
   * Initialise le composant :
   * - récupère l’identifiant de l’événement depuis la route
   * - déclenche le chargement de l’événement via la facade
   * - initialise le formulaire une fois les données disponibles
   */
  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (!id) return;

        this.eventId = id;

        this.editEventFacade.loadEvent(id).subscribe({
          next: () => this.initForm(),
          error: () => { }
        });
      });
  }

  /**
   * Initialise le formulaire d’édition à partir de l’événement chargé.
   *
   * Le formulaire est construit une seule fois,
   * puis partagé avec les composants enfants.
   */
  initForm() {
    const e = this.event();
    if (!e) return;

    this.form = this.fb.group({
      title: [e.title],
      description: [e.description],
      eventDate: [parseLocalDate(e.eventDate)],
      startTime: [e.startTime],
      endTime: [e.endTime],
      maxParticipants: [e.maxParticipants],
      material: [e.material],
      level: [e.level],
      activityName: [e.activityName],
      activityId: [null],
      status: [e.status],
      address: this.fb.group({
        street: [e.address.street, Validators.required],
        city: [e.address.city, Validators.required],
        postalCode: [e.address.postalCode, Validators.required],
      })
    });
  }

  /**
   * Agrège les données du formulaire et déclenche la mise à jour de l’événement.
   *
   * - fusionne les valeurs du formulaire avec l’événement courant
   * - normalise la date
   * - délègue la mise à jour à `EditEventFacade`
   * - redirige vers le profil après succès
   */
  saveChanges() {
    const updated = {
      ...this.event()!,
      ...this.form.value,
      eventDate: formatLocalDate(this.form.value.eventDate),
      address: this.form.value.address
    };

    this.editEventFacade.updateEvent(this.eventId, updated).subscribe(() => {
      this.router.navigate(['/profile']);
    });
  }

  /**
   * Déclenche la recherche de suggestions d’adresse.
   *
   * @param query Texte saisi par l’utilisateur
   */
  onAddressInput(query: string) {
    if (!query) return;
    this.editEventFacade.getAddressSuggestions(query).subscribe();
  }
  
  /**
   * Applique une adresse sélectionnée au formulaire.
   *
   * @param address Adresse choisie dans les suggestions
   */
  onAddressSelect(address: AddressSuggestion) {
    this.form.patchValue({
      address: {
        street: address.street,
        city: address.city,
        postalCode: address.postalCode
      }
    });
  }
}
