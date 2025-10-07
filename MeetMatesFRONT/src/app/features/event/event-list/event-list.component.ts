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
  activityName: string = 'Toutes les activités';
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService); 

  ngOnInit(): void {
    const activityId = this.route.snapshot.paramMap.get('activityId');

    if (activityId) {
      this.fetchActivityName(activityId);
      this.fetchEventsByActivity(activityId);
    } else {
      this.fetchAllEvents();
    }
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
  getLevelLabel(level: string): string {
  switch(level) {
    case 'BEGINNER': return 'Débutant';
    case 'INTERMEDIATE': return 'Intermédiaire';
    case 'EXPERT': return 'Expert';
    case 'ALL_LEVELS': return 'Tous niveaux';
    default: return level;
  }
}

getMaterialLabel(material: string): string {
  switch(material) {
    case 'YOUR_OWN': return 'Apporter votre matériel';
    case 'PROVIDED': return 'Matériel fourni';
    case 'NOT_REQUIRED': return 'Pas de matériel requis';
    default: return material;
  }
}

getStatusLabel(status: string): string {
  switch(status) {
    case 'OPEN': return 'Ouvert';
    case 'FULL': return 'Complet';
    case 'CANCELLED': return 'Annulé';
    case 'FINISHED': return 'Terminé';
    default: return status;
  }
}

}
