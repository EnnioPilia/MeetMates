import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../../../core/services/signals/signals.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { EventResponse } from '../../../core/models/event-response.model';
import { Activity } from '../../../core/models/activity.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { EventService } from '../../../core/services/event/event-service.service';
import { BackButtonComponent } from '../../../shared/components-material-angular/back-button/back-button.component'; 

@Component({
  selector: 'app-event-list',
  standalone: true,
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatSnackBarModule,
    BackButtonComponent
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
    this.http.get(`${this.baseUrl}/user/me`, { withCredentials: true }).subscribe({
      next: (user: any) => {
        console.log('Utilisateur connecté:', user);
        this.signals.setCurrentUser(user);
      },
      error: (err) => {
        console.warn('Aucun utilisateur connecté :', err);
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

    this.http.post(
      `${this.baseUrl}/event-user/join`,
      { eventId, userId: user.id },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.notification.showSuccess('Vous avez envoyer une demande de participation ');
      },
      error: (err) => {
        console.error('❌ Erreur participation :', err);
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
    this.eventService.fetchAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
        this.updatePageTitle('Toutes les activités');
      },
      error: (err) => {
        console.error('Erreur chargement événements :', err);
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
      error: (err) => {
        console.error('Erreur chargement événements par activité :', err);
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
      error: (err) => {
        console.error('Erreur récupération nom activité :', err);
        this.activityName = 'Activité inconnue';
        this.updatePageTitle('Activité inconnue');
      },
    });
  }

  private updatePageTitle(title: string) {
    this.signals.setPageTitle(title);
  }

  getFullImageUrl(relativePath: string): string {
    return relativePath.startsWith('http')
      ? relativePath
      : `${this.baseUrl}${relativePath}`;
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

  getParticipationLabel(status: string | null | undefined): string {
    return this.eventService.getParticipationLabel(status);
  }
}
