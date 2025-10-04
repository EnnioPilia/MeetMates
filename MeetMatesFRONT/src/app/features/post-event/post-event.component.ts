import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Ajout
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule // ✅ Import du module
  ]
})
export class PostEventComponent implements OnInit {
  form: FormGroup;
  activities: any[] = [];
  formSubmitted = false;
  isSubmitting = false;
  private baseUrl = environment.apiUrl;

  /** 🧩 Options de matériel */
  materialOptions = [
    { label: 'Fournis', value: 'fournis' },
    { label: 'Amener son matériel', value: 'perso' },
    { label: 'Pas de matériel requis', value: 'aucun' }
  ];

  /** 🧠 Niveaux disponibles */
  levelOptions = [
    { label: 'Débutant', value: 'debutant' },
    { label: 'Intermédiaire', value: 'intermediaire' },
    { label: 'Expert', value: 'expert' },
    { label: 'Tous niveaux', value: 'tous' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar // ✅ Injection du service
  ) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      participants: [1, [Validators.required, Validators.min(1)]],
      materiel: ['', Validators.required],
      niveau: ['', Validators.required],
      adresse: ['', Validators.required],
      activityId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllActivities();
  }

  /** 🔄 Récupère toutes les activités */
  getAllActivities(): void {
    this.http.get<any[]>(`${this.baseUrl}/activity`).subscribe({
      next: (data) => {
        this.activities = data;
        console.log('✅ Activités chargées :', this.activities);
      },
      error: (err) => console.error('❌ Erreur lors du chargement des activités :', err)
    });
  }

  /** ✅ Soumission du formulaire */
  onSubmit(): void {
    this.formSubmitted = true;
    this.isSubmitting = true;

    if (this.form.invalid) {
      this.snackBar.open(
        'Veuillez remplir correctement tous les champs avant de continuer.',
        'Fermer',
        {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        }
      );
      this.isSubmitting = false;
      return;
    }

    const { heureDebut, heureFin } = this.form.value;
    if (heureFin <= heureDebut) {
      this.snackBar.open('⚠️ L’heure de fin doit être après l’heure de début.', 'Fermer', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snack-warning']
      });
      this.isSubmitting = false;
      return;
    }

    console.log('✅ Activité créée :', this.form.value);

    this.snackBar.open('🎉 Activité créée avec succès !', 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snack-success']
    });

    this.isSubmitting = false;
  }
}
