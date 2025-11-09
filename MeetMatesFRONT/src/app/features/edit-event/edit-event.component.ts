import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event/event-service.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventDetails } from '../../core/models/event-details.model';
import { EditEventInfoComponent } from './components/edit-event-info.component';
import { EditEventDetailsComponent } from './components/edit-event-details.component';
import { EditEventAddressComponent } from './components/edit-event-address.component';
import { EditEventDateTimeComponent } from './components/edit-event-dateTime.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { EditEventActivityComponent } from './components/edit-event-activity.component';
import { AddressService, AddressSuggestion } from '../../core/services/address/address.service';
import { ActivityService } from '../../core/services/activity/activity.service';
import { Activity } from '../../core/models/activity.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorHandlerService } from '../../core/services/error-handler/error-handler.service';

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
export class EditEventComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private activityService = inject(ActivityService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private addressService = inject(AddressService);
  private errorHandler = inject(ErrorHandlerService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly activities = signal<Activity[]>([]);
  readonly addressSuggestions = signal<AddressSuggestion[]>([]);

  eventId!: string;
  event?: EventDetails;
  form!: FormGroup;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.error.set('ID de l’événement manquant.');
        this.loading.set(false);
        return;
      }
      this.eventId = id;
      this.loadActivitiesAndEvent();
    });
  }

  private loadActivitiesAndEvent(): void {
    const activities$ = this.activityService.fetchAllActivities();
    const event$ = this.eventService.fetchEventById(this.eventId);

    forkJoin([activities$, event$])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors du chargement des données.');
          this.loading.set(false);
          this.error.set('Erreur lors du chargement des données.');
          return EMPTY;
        })
      )
      .subscribe(([activities, event]) => {
        this.activities.set(activities);
        this.event = event;
        this.initForm(event);
        this.loading.set(false);
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

    if (this.activities()?.length && event.activityName) {
      const match = this.activities().find(a => a.name === event.activityName);
      if (match) {
        this.form.patchValue({ activityId: match.id });
      } else {
        this.notification.showWarning(`Aucune activité correspondante trouvée pour "${event.activityName}".`);
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors de la mise à jour.');
          this.error.set('Erreur lors de la mise à jour.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.notification.showSuccess('✅ Événement mis à jour avec succès.');
        this.router.navigate(['/profile']);
      });
  }

  onAddressInput(value: string): void {
    this.addressService.getAddressSuggestions(value)
      .pipe(
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors du chargement des suggestions.');
          return EMPTY;
        })
      )
      .subscribe(suggestions => this.addressSuggestions.set(suggestions));
  }

  private parseAddress(label: string) {
    if (!label) return { street: '', postalCode: '', city: '' };
    const match = label.match(/^(.*)\s(\d{5})\s(.+)$/);
    return match
      ? { street: match[1].trim(), postalCode: match[2], city: match[3].trim() }
      : { street: label, postalCode: '', city: '' };
  }
}
