import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface EventUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  participationStatus: string;
  joinedAt?: string;
}

export interface EventDetails {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  addressLabel: string;
  activityName: string;
  organizerName: string;
  level: string;
  material: string;
  status: string;
  maxParticipants: number;
  imageUrl?: string;
  participationStatus: string | null; // ✅ peut être null si pas connecté
  acceptedParticipants: EventUser[];
  pendingParticipants: EventUser[];
  rejectedParticipants: EventUser[];
}


@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  loading = true;
  event?: EventDetails;
  baseUrl = environment.apiUrl;

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.http.get<EventDetails>(`${this.baseUrl}/event/${eventId}`).subscribe({
        next: (data) => {
          this.event = data;
          console.log('✅ Event details loaded:', data);

          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur chargement événement:', err);
          this.loading = false;
        }
      });
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
getParticipationLabel(status: string | null): string {
  switch (status) {
    case 'ACCEPTED':
      return 'Accepté';
    case 'PENDING':
      return 'En attente';
    case 'REJECTED':
      return 'Refusé';
    case null:
    case undefined:
    default:
      return 'Non inscrit';
  }
}

}
