import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

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
  ],
})
export class PostEventComponent implements OnInit {
  form!: FormGroup;
  activities: any[] = [];
  addressSuggestions: any[] = [];
  isSubmitting = false;
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

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllActivities();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(1)]],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      participants: [1, [Validators.required, Validators.min(1)]],
      materiel: ['', Validators.required],
      niveau: ['', Validators.required],
      adresse: ['', Validators.required],
      activityId: ['', Validators.required],
    });
  }

  private getAllActivities(): void {
    this.http.get<any[]>(`${this.baseUrl}/activity`).subscribe({
      next: (data) => (this.activities = data),
      error: (err) => console.error('❌ Erreur lors du chargement des activités :', err),
    });
  }

  /** 🌍 Autocomplétion adresse avec Nominatim */
onAddressInput(): void {
  const query = this.form.get('adresse')?.value?.trim();
  if (!query || query.length < 3) {
    this.addressSuggestions = [];
    return;
  }

  this.http
    .get<any>('https://api-adresse.data.gouv.fr/search/', {
      params: {
        q: query,
        limit: 5
      }
    })
    .subscribe({
      next: (data) => {
        this.addressSuggestions = data.features.map((f: any) => ({
          display_name: f.properties.label,
          city: f.properties.city,
          postalCode: f.properties.postcode
        }));
      },
      error: () => (this.addressSuggestions = [])
    });
}


  onAddressSelect(selected: string): void {
    this.form.get('adresse')?.setValue(selected);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.showSnack('Veuillez remplir tous les champs correctement.', 'error');
      return;
    }

    this.isSubmitting = true;
    const { titre, description, date, heureDebut, heureFin, participants, materiel, niveau, adresse, activityId } =
      this.form.value;

    const eventPayload = {
      title: titre,
      description,
      eventDate: this.formatDate(date),
      startTime: heureDebut,
      endTime: heureFin,
      maxParticipants: participants,
      material: materiel,
      level: niveau,
      status: 'OPEN',
      activityId,
      address: { street: adresse, city: '', postalCode: '' },
    };

    console.log('📦 Payload envoyé au backend :', eventPayload);

    this.http.post(`${this.baseUrl}/event`, eventPayload, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log('✅ Événement créé :', res);
        this.showSnack('🎉 Activité créée avec succès !', 'success');
        this.form.reset();
      },
      error: (err) => {
        console.error('❌ Erreur backend :', err);
        this.showSnack('Erreur lors de la création de l’activité.', 'error');
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private showSnack(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`snack-${type}`],
    });
  }
}
