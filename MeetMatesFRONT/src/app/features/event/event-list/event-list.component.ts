import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { EventService } from '../../../core/services/event/event-service.service';
import { EventResponse } from '../../../core/models/event-response.model';
import { Activity } from '../../../core/models/activity.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    EventInfoComponent,
    EventHeaderComponent,
    AppButtonComponent
  ],
})
export class EventListComponent implements OnInit, OnDestroy {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);
  private destroy$ = new Subject<void>();

  loading = true;
  events: EventResponse[] = [];
  activityName = 'Toutes les activités';

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.http.get(`${this.baseUrl}/user/me`, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.signals.setCurrentUser(user);
        },
        error: () => {
          this.signals.clearCurrentUser();
        },
      });

    const activityId = this.route.snapshot.paramMap.get('activityId');
    if (activityId) {
      this.fetchActivityName(activityId);
      this.fetchEventsByActivity(activityId);
    } else {
      this.fetchAllEvents();
    }
  }

  joinEvent(eventId: string): void {
    const user = this.signals.currentUser();

    if (!user) {
      this.notification.showError('Vous devez être connecté pour participer à un événement.');
      return;
    }

    this.http.post(`${this.baseUrl}/event-user/join`, { eventId, userId: user.id }, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.notification.showSuccess('Demande de participation envoyée.'),
        error: (err) => {
          if (err.status === 409) {
            this.notification.showWarning('Vous participez déjà à cet événement.');
          } else if (err.status === 410) {
            this.notification.showError('Vous avez été retiré de cette activité.');
          } else if (err.status === 401) {
            this.notification.showError('Vous devez être connecté pour participer.');
          } else {
            this.notification.showError('Une erreur est survenue.');
          }
        },
      });
  }

  fetchAllEvents(): void {
    this.loading = true;
    this.eventService.fetchAllEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
          this.updatePageTitle('Toutes les activités');
        },
        error: () => {
          this.loading = false;
          this.updatePageTitle('Toutes les activités');
        },
      });
  }

  fetchEventsByActivity(activityId: string): void {
    this.http.get<EventResponse[]>(`${this.baseUrl}/event/activity/${activityId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  fetchActivityName(activityId: string): void {
    this.http.get<Activity>(`${this.baseUrl}/activity/${activityId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (activity) => {
          this.activityName = activity.name;
          this.updatePageTitle(activity.name);
        },
        error: () => {
          this.activityName = 'Activité inconnue';
          this.updatePageTitle('Activité inconnue');
        },
      });
  }

  private updatePageTitle(title: string) {
    this.signals.setPageTitle(title);
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  isEventOpen(event: any): boolean {
    return (event?.status ?? '').toUpperCase() === 'OPEN';
  }

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getLevelLabel(level: string): string {
    return this.eventService.getLevelLabel(level)
  }

  getMaterialLabel(material: string): string {
    return this.eventService.getMaterialLabel(material);
  }
}
