import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../core/services/notification/notification.service';
import { PostSelectComponent } from './components/post-select.component';
import { PostTextFieldsComponent } from './components/post-text-fields.component';
import { PostDateTimeComponent } from './components/post-date-time.component';
import { PostOptionsComponent } from './components/post-options.component';
import { PostAddressComponent } from './components/post-address.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { AddressService, AddressSuggestion } from '../../core/services/address/address.service';
import { MATERIAL_OPTIONS, LEVEL_OPTIONS } from '../../shared-components/constants/event-option';

@Component({
  selector: 'app-post-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCardModule,
    PostSelectComponent,
    PostTextFieldsComponent,
    PostAddressComponent,
    PostDateTimeComponent,
    PostOptionsComponent,
    AppButtonComponent
  ],
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss']
})
export class PostEventComponent implements OnInit {
  private baseUrl = environment.apiUrl;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notification = inject(NotificationService);
  private readonly addressService = inject(AddressService);

  form!: FormGroup;
  activities: any[] = [];
  addressSuggestions: AddressSuggestion[] = [];
  previewUrl?: string | null = null;
  selectedFile: File | null = null;
  selectedAddress?: string;
  isSubmitting = false;
  materialOptions = MATERIAL_OPTIONS;
  levelOptions = LEVEL_OPTIONS;

  ngOnInit(): void {
    this.buildForm();
    this.loadActivities();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required]],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      participants: ['', [Validators.required, Validators.min(2)]],
      materiel: ['', Validators.required],
      niveau: ['', Validators.required],
      adresse: ['', Validators.required],
      activityId: ['', Validators.required]
    });
  }

  private loadActivities(): void {
    this.http.get<any[]>(`${this.baseUrl}/activity`).subscribe({
      next: data => (this.activities = data),
      error: () => this.notification.showError('Erreur lors du chargement des activités.')
    });
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  onAddressInput(value: string): void {
    this.addressService.getAddressSuggestions(value).subscribe({
      next: (suggestions) => (this.addressSuggestions = suggestions)
    });
  }

  onAddressSelect(value: string): void {
    this.selectedAddress = value;
    this.form.get('adresse')?.setValue(value);
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.notification.showError('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.isSubmitting = true;
    const { titre, description, date, startTime, endTime, participants, materiel, niveau, adresse, activityId } = this.form.value;

    const eventPayload = {
      title: titre,
      description,
      eventDate: this.formatDate(date),
      startTime: startTime,
      endTime,
      maxParticipants: participants,
      material: materiel,
      level: niveau,
      status: 'OPEN',
      activityId,
      address: { street: adresse, city: '', postalCode: '' },
    };

    this.http.post<any>(`${this.baseUrl}/event`, eventPayload, { withCredentials: true }).subscribe({
      next: (res) => {
        const eventId = res?.id || res?.eventId;
        if (!eventId) {
          this.notification.showWarning('Activité créée, mais identifiant introuvable.');
          this.resetForm();
          return;

        } else {
          this.notification.showSuccess('🎉 Activité créée avec succès !');
          this.resetForm();
        }
      },
      error: () => {
        this.notification.showError('Erreur lors de la création de l’activité. Etez-vous connecté ?');
        this.isSubmitting = false;
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
  }
}
