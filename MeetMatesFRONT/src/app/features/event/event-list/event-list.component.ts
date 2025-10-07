import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../../../core/services/signals/signals.service';

// Angular Material
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
  maxParticipants: number;
  participantNames: string[];
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
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute,  private signals: SignalsService) {}

  ngOnInit(): void {
    const activityId = this.route.snapshot.paramMap.get('activityId');
    if (activityId) {
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
      },
      error: (err) => {
        console.error('Erreur chargement événements :', err);
        this.loading = false;
      },
    });
  }

fetchEventsByActivity(activityId: string): void {
  this.http.get<EventItem[]>(`${this.baseUrl}/event/activity/${activityId}`).subscribe({
    next: (data) => {
      this.events = data;
      this.loading = false;

      // Mettre à jour le titre du header avec le nom de l'activité
      if (data.length > 0) {
        const activityName = data[0].activityName; // on prend le nom depuis le premier event
        this.signals.setPageTitle(`${activityName}`);
      } else {
        this.signals.setPageTitle('Aucune activité trouvée');
      }
    },
    error: (err) => {
      console.error('Erreur chargement événements par activité :', err);
      this.loading = false;
      this.signals.setPageTitle('Erreur chargement activité');
    },
  });
}

}
