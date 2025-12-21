// Angular
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Core (services)
import { NotificationService } from '../../core/services/notification/notification.service';

// Feature components
import { PostSelectComponent } from './components/post-select.component';
import { PostTextFieldsComponent } from './components/post-text-fields.component';
import { PostDateTimeComponent } from './components/post-date-time.component';
import { PostOptionsComponent } from './components/post-options.component';
import { PostAddressComponent } from './components/post-address.component';

// Shared components
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { MATERIAL_OPTIONS, LEVEL_OPTIONS } from '../../shared-components/constants/event-option';
import { EventFacade } from '../../core/facades/events/event/event.facade';

/**
 * Composant parent chargé de la création (publication)
 * d’un nouvel événement.
 *
 * Responsabilités :
 * - initialiser et porter le formulaire racine de création
 * - charger les activités disponibles via `EventFacade`
 * - orchestrer les sous-parties du formulaire via des composants enfants
 * - gérer la sélection et l’aperçu d’une image
 * - transformer les données du formulaire en payload API
 * - déclencher la création de l’événement
 *
 * Architecture :
 * - `PostTextFieldsComponent` : titre et description
 * - `PostDateTimeComponent` : date et horaires
 * - `PostOptionsComponent` : matériel, niveau, participants
 * - `PostAddressComponent` : saisie et sélection de l’adresse
 * - `PostSelectComponent` : sélection de l’activité
 */
@Component({
  selector: 'app-post-event',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule,
    MatSelectModule, MatRadioModule,
    MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule, MatIconModule, 
    MatCardModule, PostSelectComponent, 
    PostTextFieldsComponent, PostAddressComponent, 
    PostDateTimeComponent, PostOptionsComponent, 
    AppButtonComponent, MatProgressSpinnerModule,
  ],
  templateUrl: './post-event.component.html',
})
export class PostEventComponent implements OnInit {

  private fb = inject(FormBuilder);
  private eventFacade = inject(EventFacade);
  private notification = inject(NotificationService);

  /** Formulaire racine de création de l’événement */
  form!: FormGroup;

  /** Données exposées par la facade */
  activities = this.eventFacade.activities;
  suggestions = this.eventFacade.addressSuggestions;
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

  /** Gestion de l’aperçu d’image */
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  /** Options statiques */
  materialOptions = MATERIAL_OPTIONS;
  levelOptions = LEVEL_OPTIONS;

  /**
   * Initialise le composant :
   * - construit le formulaire
   * - charge la liste des activités disponibles
   */
  ngOnInit() {
    this.buildForm();
    this.eventFacade.loadActivities().subscribe();
  }
  
  /** Indique si une soumission est en cours */
  get isSubmitting() {
    return this.eventFacade.isSubmitting;
  }
  
  /** Construit le formulaire de création d’événement.*/
  private buildForm() {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      participants: ['', [Validators.required, Validators.min(2)]],
      materiel: ['', Validators.required],
      niveau: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        postalCode: ['', Validators.required],
        city: ['', Validators.required],
      }),
      activityId: ['', Validators.required]
    });
  }

  /**
   * Déclenche la recherche de suggestions d’adresse.
   *
   * @param value Texte saisi par l’utilisateur
   */
  onAddressInput(value: string) {
    this.eventFacade.searchAddress(value).subscribe();
  }

  /**
   * Applique une adresse sélectionnée au formulaire.
   *
   * @param value Adresse normalisée
   */
  onAddressSelect(value: {
    street: string;
    city: string;
    postalCode: string;
  }) {
    this.form.patchValue({
      address: value
    });
  }

  /**
   * Gère la sélection d’une image et génère un aperçu.
   *
   * @param file Fichier image sélectionné
   */
  onFileSelected(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  /** Supprime l’image sélectionnée. */
  removeImage() {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  /**
   * Soumet le formulaire de création d’événement.
   *
   * - valide le formulaire
   * - mappe les données vers le format attendu par l’API
   * - déclenche la création via la facade
   * - réinitialise le formulaire après succès
   */
  onSubmit() {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir tous les champs correctement.');
      return;
    }

    const payload = this.mapPayload();

    this.eventFacade.createEvent(payload).subscribe(() => {
      this.resetForm();
    });
  }

  /** Transforme les valeurs du formulaire en payload compatible avec l’API */
  private mapPayload() {
    const f = this.form.value;

    return {
      title: f.titre,
      description: f.description,
      eventDate: this.formatDate(f.date),
      startTime: f.startTime,
      endTime: f.endTime,
      maxParticipants: f.participants,
      material: f.materiel,
      level: f.niveau,
      status: 'OPEN',
      activityId: f.activityId,
      address: {
        street: f.address.street,
        city: f.address.city,
        postalCode: f.address.postalCode
      }
    };
  }

  /**
   * Formate une date au format `YYYY-MM-DD`.
   *
   * @param date Date brute
   */
  private formatDate(date: string | Date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  /** Réinitialise le formulaire et l’aperçu. */
  private resetForm() {
    this.form.reset();
    this.previewUrl = null;
    this.selectedFile = null;
  }
}
