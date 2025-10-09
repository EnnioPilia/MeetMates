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

interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  addressLabel: string;
  activityName: string;
  organizerName: string;
  level: string;
  material: string;
  status: string;
  maxParticipants: number;
  participantNames: string[];
  imageUrl?: string;
}

interface Activity {
  id: string;
  name: string;
}

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
  ],
})
export class EventListComponent implements OnInit {
  loading = true;
  events: EventItem[] = [];
  activityName = 'Toutes les activités';
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService);

  ngOnInit(): void {
    // 🔹 Charger l'utilisateur connecté via le cookie
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

    console.log('Join event payload:', { eventId, userId: user?.id });

    // 🚫 Si pas connecté
    if (!user) {
      alert('Vous devez être connecté pour participer à un événement.');
      return;
    }

    this.http.post(
      `${this.baseUrl}/event-user/join`,
      { eventId, userId: user.id },
      { withCredentials: true }
    ).subscribe({
      next: (res) => {
        console.log('Participation enregistrée :', res);
        alert('Vous participez à cet événement 🎉');
      },
      error: (err) => {
        console.error('Erreur participation :', err);
        if (err.status === 401) {
          alert('Vous devez être connecté pour participer à un événement.');
        } else {
          alert('Une erreur est survenue.');
        }
      },
    });
  }

  fetchAllEvents(): void {
    this.http.get<EventItem[]>(`${this.baseUrl}/event`).subscribe({
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
    this.http.get<EventItem[]>(`${this.baseUrl}/event/activity/${activityId}`).subscribe({
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

  getLevelLabel(level: string): string {
    switch (level) {
      case 'BEGINNER': return 'Débutant';
      case 'INTERMEDIATE': return 'Intermédiaire';
      case 'EXPERT': return 'Expert';
      case 'ALL_LEVELS': return 'Tous niveaux';
      default: return level;
    }
  }

  getMaterialLabel(material: string): string {
    switch (material) {
      case 'YOUR_OWN': return 'Apporter votre matériel';
      case 'PROVIDED': return 'Matériel fourni';
      case 'NOT_REQUIRED': return 'Pas de matériel requis';
      default: return material;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN': return 'Ouvert';
      case 'FULL': return 'Complet';
      case 'CANCELLED': return 'Annulé';
      case 'FINISHED': return 'Terminé';
      default: return status;
    }
  }
}
