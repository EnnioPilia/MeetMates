// ---------- Angular Core & Utilities ----------
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// ---------- Angular Material ----------
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
// ---------- Services ----------
import { NotificationService } from '../../core/services/notification/notification.service';
// ---------- Composants enfant ----------
import { PostSelectComponent } from './components/post-select.component';
import { PostTextFieldsComponent } from './components/post-text-fields.component';
import { PostDateTimeComponent } from './components/post-date-time.component';
import { PostOptionsComponent } from './components/post-options.component';
import { PostAddressComponent } from './components/post-address.component';
// ---------- Composants Shared ----------
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { MATERIAL_OPTIONS, LEVEL_OPTIONS } from '../../shared-components/constants/event-option';
import { EventFacade } from '../../core/facades/event/event.facade';


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
    AppButtonComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-event.component.html',
})
export class PostEventComponent implements OnInit {

  private fb = inject(FormBuilder);
  private eventFacade = inject(EventFacade);
  private notification = inject(NotificationService);

  form!: FormGroup;

  activities = this.eventFacade.activities;
  suggestions = this.eventFacade.addressSuggestions;
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

  previewUrl: string | null = null;
  selectedFile: File | null = null;

  materialOptions = MATERIAL_OPTIONS;
  levelOptions = LEVEL_OPTIONS;

  ngOnInit() {
    this.buildForm();
    this.eventFacade.loadActivities();
  }

  get isSubmitting() {
    return this.eventFacade.isSubmitting;
  }
  
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
      adresse: ['', Validators.required],
      activityId: ['', Validators.required]
    });
  }

  onAddressInput(value: string) {
    this.eventFacade.searchAddress(value);
  }

  onAddressSelect(value: string) {
    this.form.get('adresse')?.setValue(value);
  }

  onFileSelected(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.previewUrl = null;
    this.selectedFile = null;
  }

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
        street: f.adresse,
        city: '',
        postalCode: ''
      }
    };
  }

  private formatDate(date: any) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
  }

  private resetForm() {
    this.form.reset();
    this.previewUrl = null;
    this.selectedFile = null;
  }
}
