import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event/event-service.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventDetails } from '../../core/models/event-details.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EditEventInfoComponent } from './components/edit-event-info.component';
import { EditEventDetailsComponent } from './components/edit-event-details.component';
import { EditEventAddressComponent } from './components/edit-event-address.component';
import { EditEventDateTimeComponent } from './components/edit-event-dateTime.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { EditEventActivityComponent } from './components/edit-event-activity.component';
import { AddressService, AddressSuggestion } from '../../core/services/address/address.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    EditEventInfoComponent,
    EditEventDetailsComponent,
    EditEventAddressComponent,
    EditEventDateTimeComponent,
    EditEventActivityComponent,
    AppButtonComponent
  ],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private readonly addressService = inject(AddressService);

  eventId!: string;
  event?: EventDetails;
  form!: FormGroup;
  loading = true;
  activities: any[] = [];
  addressSuggestions: AddressSuggestion[] = [];

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.notification.showError('ID de l’événement manquant.');
        this.loading = false;
        return;
      }
      this.eventId = id;
      this.loadActivitiesAndEvent();
    });
  }

  private loadActivitiesAndEvent(): void {
    const activities$ = this.http.get<any[]>(`${this.baseUrl}/activity`);
    const event$ = this.eventService.getEventById(this.eventId);

    forkJoin([activities$, event$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([activities, event]) => {
          this.activities = activities;
          this.event = event;
          this.initForm(event);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.notification.showError('Erreur lors du chargement des données.');
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getEventById(this.eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.event = data;
          this.initForm(data);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.notification.showError('❌ Impossible de charger les détails de l’événement.');
        }
      });
  }

  private initForm(event: EventDetails): void {
    this.form = this.fb.group({
      title: [event.title],
      description: [event.description],
      activityName: [event.activityName || ''],
      activityId: [null],
      level: [event.level],
      maxParticipants: [event.maxParticipants],
      material: [event.material],
      eventDate: [event.eventDate],
      startTime: [event.startTime],
      endTime: [event.endTime],
      addressLabel: [event.addressLabel],
      status: [event.status]
    });

    if (this.activities?.length && event.activityName) {
      const match = this.activities.find(a => a.name === event.activityName);
      if (match) {
        this.form.patchValue({ activityId: match.id });
      } else {
        console.warn(' Aucune activité trouvée pour', event.activityName);
      }
    }
  }

  saveChanges(): void {
    if (!this.form.valid || !this.eventId) return;
    const updated: EventDetails = {
      ...this.event!,
      ...this.form.value,
      id: this.eventId,
      address: this.parseAddress(this.form.value.addressLabel)
    };

    this.eventService.updateEvent(this.eventId, updated)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.showSuccess('✅ Événement mis à jour avec succès.');
          this.router.navigate(['/profile']);
        },
        error: () => {
          this.notification.showError('❌ Erreur lors de la mise à jour.');
        }
      });
  }

  onAddressInput(value: string): void {
    this.addressService.getAddressSuggestions(value).subscribe({
      next: (suggestions) => (this.addressSuggestions = suggestions)
    });
  }

  private parseAddress(label: string) {
    const match = label.match(/^(.*)\s(\d{5})\s(.+)$/);
    if (!match) return { street: label, postalCode: '', city: '' };

    return {
      street: match[1].trim(),
      postalCode: match[2],
      city: match[3].trim()
    };
  }
}
