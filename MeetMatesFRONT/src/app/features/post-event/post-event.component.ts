import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Angular Material imports
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTimepickerToggle } from '@angular/material/timepicker';

import { NotificationService } from '../../core/services/notification/notification.service';
import { EventService } from '../../core/services/event/event-service.service';

@Component({
  selector: 'app-post-event',
  standalone: true,
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatTimepickerModule
  ],
})
export class PostEventComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private notification = inject(NotificationService);

  form!: FormGroup;
  activities: any[] = [];
  addressSuggestions: any[] = [];
  isSubmitting = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  private baseUrl = environment.apiUrl;

  materialOptions = [
    { label: 'Fournis', value: 'PROVIDED' },
    { label: 'Amener son matériel', value: 'YOUR_OWN' },
    { label: 'Pas de matériel requis', value: 'NOT_REQUIRED' },
  ];

  levelOptions = [
    { label: 'Débutant', value: 'BEGINNER' },
    { label: 'Intermédiaire', value: 'INTERMEDIATE' },
    { label: 'Expert', value: 'EXPERT' },
    { label: 'Tous niveaux', value: 'ALL_LEVELS' },
  ];

  ngOnInit(): void {
    this.buildForm();
    this.loadActivities();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(1)]],
      date: ['', Validators.required],
      starTime: ['', Validators.required],
      endTime: ['', Validators.required],
      participants: [ '',[Validators.required, Validators.min(1)]],
      materiel: ['', Validators.required],
      niveau: ['', Validators.required],
      adresse: ['', Validators.required],
      activityId: ['', Validators.required],
    });
  }

  private loadActivities(): void {
    this.http.get<any[]>(`${this.baseUrl}/activity`).subscribe({
      next: (data) => (this.activities = data),
      error: (err) => {
        console.error('❌ Erreur lors du chargement des activités :', err);
        this.notification.showError('Erreur lors du chargement des activités.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  // === Adresse ===
  onAddressInput(): void {
    const query = this.form.get('adresse')?.value?.trim();
    if (!query || query.length < 3) {
      this.addressSuggestions = [];
      return;
    }

    this.http
      .get<any>('https://api-adresse.data.gouv.fr/search/', {
        params: { q: query, limit: 5 },
      })
      .subscribe({
        next: (data) => {
          this.addressSuggestions = data.features.map((f: any) => ({
            display_name: f.properties.label,
            city: f.properties.city,
            postalCode: f.properties.postcode,
          }));
        },
        error: () => (this.addressSuggestions = []),
      });
  }

  onAddressSelect(selected: string): void {
    this.form.get('adresse')?.setValue(selected);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showError('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.isSubmitting = true;
    const { titre, description, date, starTime, endTime, participants, materiel, niveau, adresse, activityId } =
      this.form.value;

    const eventPayload = {
      title: titre,
      description,
      eventDate: this.formatDate(date),
      startTime: starTime,
      endTime,
      maxParticipants: participants,
      material: materiel,
      level: niveau,
      status: 'OPEN',
      activityId,
      address: { street: adresse, city: '', postalCode: '' },
    };

    console.log('📦 Payload envoyé au backend :', eventPayload);

    this.http.post<any>(`${this.baseUrl}/event`, eventPayload, { withCredentials: true }).subscribe({
      next: (res) => {

        const eventId = res?.id || res?.eventId;
        if (!eventId) {
          this.notification.showWarning('Activité créée, mais identifiant introuvable.');
          this.resetForm();
          return;
        }

        if (this.selectedFile) {
          this.uploadImage(eventId);
        } else {
          this.notification.showSuccess('🎉 Activité créée avec succès !');
          this.resetForm();
        }
      },
      error: (err) => {
        this.notification.showError('Erreur lors de la création de l’activité.');
        this.isSubmitting = false;
      },
    });
  }

  private uploadImage(eventId: string): void {
    const formData = new FormData();
    formData.append('file', this.selectedFile as Blob);
    formData.append('isMain', 'true');

    this.http
      .post(`${this.baseUrl}/event/${eventId}/picture`, formData, { withCredentials: true })
      .subscribe({
        next: () => {
          this.notification.showSuccess('Votre activité a été enregistrées avec succès !');
          this.resetForm();
        },
        error: (err) => {
          this.notification.showWarning('Activité créée, mais échec de l’envoi de la photo.');
          this.resetForm();
        },
      });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private resetForm(): void {
    this.form.reset();
    this.previewUrl = null;
    this.selectedFile = null;
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }
}
