// Angular
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Core (services, models)
import { AddressSuggestion } from '../../core/services/address/address.service';
import { EventFormMode, EventFormValue } from '../../core/models/event-form.model';
import { Activity } from '../../core/models/activity.model';

// Feature components
import { EventInfoComponent } from './components/event-info.component';
import { EventDateTimeComponent } from './components/event-date-time.component';
import { EventAddressComponent } from './components/event-address.component';
import { EventDetailsComponent } from './components/event-details.component';
import { EventActivityComponent } from './components/event-activity.component';
import { NotificationService } from '../../core/services/notification/notification.service';

// Shared components
import { AppButtonComponent } from '../../shared-components/button/button.component';

/**
 * Composant central de la feature `event-form`.
 *
 * Ce composant encapsule l’intégralité du formulaire de création
 * et d’édition d’un événement.
 *
 * Il est volontairement *agnostique du contexte* :
 *
 * Le composant fonctionne en mode contrôlé via ses Inputs / Outputs
 * et est orchestré par ses composants parents :
 * - `PostEventPage` (création)
 * - `EditEventPage` (édition)
 *
 * Responsabilités :
 * - construire et valider le formulaire d’événement
 * - répartir l’UI en sous-composants spécialisés
 * - gérer la pré-remplissage des données en mode édition
 * - exposer les événements utilisateur (submit, recherche d’adresse)
 *
 * Architecture interne :
 * - `EventInfoComponent`      : informations générales
 * - `EventDateTimeComponent` : date et horaires
 * - `EventAddressComponent`  : adresse et autocomplétion
 * - `EventDetailsComponent`  : détails complémentaires
 * - `EventActivityComponent` : sélection de l’activité
 */
@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppButtonComponent,
    EventInfoComponent,
    EventDateTimeComponent,
    EventAddressComponent,
    EventDetailsComponent,
    EventActivityComponent
  ],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private notification = inject(NotificationService);

  @Input({ required: true }) mode!: EventFormMode;
  @Input() initialData?: Partial<EventFormValue>;
  @Input() activities: Activity[] = [];
  @Input() addressSuggestions: AddressSuggestion[] = [];

  @Output() addressInput = new EventEmitter<string>();
  @Output() addressSelected = new EventEmitter<AddressSuggestion>();
  @Output() submitForm = new EventEmitter<EventFormValue>();

  form!: FormGroup;

  /**
   * Initialise le formulaire.
   *
   * - construit la structure du formulaire
   * - applique les données initiales en mode édition
   * - reconstruit le champ d’affichage de l’adresse
   */
  ngOnInit(): void {
    this.buildForm();

    if (this.mode === 'edit' && this.initialData) {
      this.form.patchValue(this.initialData);

      const addr = this.form.get('address')?.value;
      if (addr?.street) {
        this.form.get('addressLabel')?.setValue(
          `${addr.street}, ${addr.postalCode} ${addr.city}`,
          { emitEvent: false }
        );
      }
    }
  }

  /** Construit la structure du formulaire réactif et définit les règles de validation. */
  private buildForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(16)]],
      description: ['', Validators.required],
      eventDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      maxParticipants: ['', [Validators.required, Validators.min(2)]],
      material: ['', Validators.required],
      level: ['', Validators.required],
      activityId: ['', Validators.required],
      status: this.mode === 'edit'
        ? ['OPEN', Validators.required]
        : null,
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
      }),

      addressLabel: ['', Validators.required],

    });
  }

  /**
   * Soumet le formulaire si celui-ci est valide.
   *
   * - marque tous les champs comme touchés en cas d’erreur
   * - affiche un message utilisateur
   * - émet les valeurs du formulaire vers le parent
   */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.showWarning(
        'Veuillez remplir tous les champs correctement.'
      );
      return;
    }

    this.submitForm.emit(this.form.value);
  }

  /**
   * Émet la saisie utilisateur pour déclencher la recherche d’adresses.
   *
   * @param query Texte saisi
   */
  onAddressInput(query: string) {
    this.addressInput.emit(query);
  }

  /**
   * Émet l’adresse sélectionnée depuis les suggestions.
   *
   * @param addr Adresse choisie
   */
  onAddressSelect(addr: AddressSuggestion) {
    this.addressSelected.emit(addr);
  }

}
