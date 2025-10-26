import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { EventService } from '../../../core/services/event/event-service.service';
import { EventResponse } from '../../../core/models/event-response.model';
import { Activity } from '../../../core/models/activity.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Shared components
import { AppButtonComponent    } from '../../../shared-components/button/button.component';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventPictureComponent } from '../../../shared-components/event-picture/event-picture.component';
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
    AppButtonComponent,
    EventHeaderComponent,
    EventPictureComponent,
    EventInfoComponent
  ],
})
export class EventListComponent implements OnInit {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);

  loading = true;
  events: EventResponse[] = [];
  activityName = 'Toutes les activités';

  ngOnInit(): void {
    // Vérifie si un utilisateur est connecté
    this.http.get(`${this.baseUrl}/user/me`, { withCredentials: true }).subscribe({
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

  // 🔹 Joindre un événement
  joinEvent(eventId: string): void {
    const user = this.signals.currentUser();

    if (!user) {
      this.notification.showError('Vous devez être connecté pour participer à un événement.');
      return;
    }

    this.http.post(`${this.baseUrl}/event-user/join`, { eventId, userId: user.id }, { withCredentials: true }).subscribe({
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

  // 🔹 Requêtes API
  fetchAllEvents(): void {
    this.loading = true;
    this.eventService.fetchAllEvents().subscribe({
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
    this.http.get<EventResponse[]>(`${this.baseUrl}/event/activity/${activityId}`).subscribe({
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
    this.http.get<Activity>(`${this.baseUrl}/activity/${activityId}`).subscribe({
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

  // 🔹 Helpers
  private updatePageTitle(title: string) {
    this.signals.setPageTitle(title);
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  getFullImageUrl(relativePath: string): string {
    return relativePath?.startsWith('http') ? relativePath : `${this.baseUrl}${relativePath}`;
  }

  isEventOpen(event: any): boolean {
    return (event?.status ?? '').toUpperCase() === 'OPEN';
  }

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getLevelLabel(level: string): string {
    return this.eventService.getLevelLabel(level);
  }

  getMaterialLabel(material: string): string {
    return this.eventService.getMaterialLabel(material);
  }
}
