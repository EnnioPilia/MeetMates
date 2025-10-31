import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../core/services/event/event-service.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventDetails } from '../../core/models/event-details.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EditEventInfoComponent } from './components/edit-event-info.component';
import { EditEventDetailsComponent } from './components/edit-event-details.component';
import { EditEventAddressComponent } from './components/edit-event-address.component';
import { EditEventDateTimeComponent } from './components/edit-event-date-time.component.ts';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { EditEventActivityComponent } from './components/edit-event-activity.component';

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
    EditEventActivityComponent
  ],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit, OnDestroy {
  eventId!: string;
  event?: EventDetails;
  form!: FormGroup;
  loading = true;
  activities: any[] = [];
  addressSuggestions: any[] = [];

  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadActivities();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = id;
        this.loadEvent();
      } else {
        this.notification.showError('ID de l’événement manquant.');
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
      level: [event.level],

      maxParticipants: [event.maxParticipants],
      material: [event.material],
      eventDate: [event.eventDate],
      startTime: [event.startTime],
      endTime: [event.endTime],
      addressLabel: [event.addressLabel],
      status: [event.status]
    });
  }

  saveChanges(): void {
    if (!this.form.valid || !this.eventId) return;

    const updated: EventDetails = {
      ...this.event!,
      ...this.form.value,
      id: this.eventId
    };

    this.eventService.updateEvent(this.eventId, updated)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.notification.showSuccess('✅ Événement mis à jour avec succès.'),
        error: () => this.notification.showError('❌ Erreur lors de la mise à jour.')
      });
  }

  cancelEdit(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Annuler les modifications', message: 'Voulez-vous vraiment quitter sans sauvegarder ?' }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.loadEvent();
      }
    });
  }
  private loadActivities(): void {
    this.http.get<any[]>(`${this.baseUrl}/activity`).subscribe({
      next: data => (this.activities = data),
      error: () => this.notification.showError('Erreur lors du chargement des activités.')
    });
  }

  onAddressInput(value: string): void {
    if (!value || value.trim().length < 3) {
      this.addressSuggestions = [];
      return;
    }

    this.http
      .get<any>('https://api-adresse.data.gouv.fr/search/', {
        params: { q: value, limit: 5 },
      })
      .subscribe({
        next: (data) => {
          this.addressSuggestions = data.features.map((f: any) => ({
            display_name: f.properties.label,
          }));
        },
        error: () => {
          this.addressSuggestions = [];
        },
      });
  }

  onAddressSelect(value: string): void {
    this.form.get('addressLabel')?.setValue(value);
  }
}
