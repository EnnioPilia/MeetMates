import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Shared
import { AppButtonComponent } from '../../shared-components/button/button.component';

import { AddressSuggestion } from '../../core/services/address/address.service';

// Feature
import { EventFormMode, EventFormValue } from '../../core/models/event-form.model';
import { Activity } from '../../core/models/activity.model';

// Children
import { EventInfoComponent } from './components/event-info.component';
import { EventDateTimeComponent } from './components/event-date-time.component';
import { EventAddressComponent } from './components/event-address.component';
import { EventDetailsComponent } from './components/event-details.component';
import { EventActivityComponent } from './components/event-activity.component';
import { NotificationService } from '../../core/services/notification/notification.service';

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
  @Output() addressInput = new EventEmitter<string>();
  @Output() addressSelected = new EventEmitter<AddressSuggestion>();
  @Input() addressSuggestions: AddressSuggestion[] = [];

  @Output() submitForm = new EventEmitter<EventFormValue>();

  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();

    if (this.mode === 'edit' && this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(15)]],
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
    });
  }

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

  onAddressInput(query: string) {
    this.addressInput.emit(query);
  }

  onAddressSelect(addr: AddressSuggestion) {
    this.addressSelected.emit(addr);
  }

}
