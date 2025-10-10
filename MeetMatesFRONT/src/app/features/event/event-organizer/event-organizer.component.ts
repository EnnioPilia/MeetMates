import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// ✅ Import des modules Material manquants
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';           // ✅ Pour <mat-tab-group>
import { MatExpansionModule } from '@angular/material/expansion'; // ✅ Pour <mat-accordion>

interface EventDetails {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  addressLabel: string;
  startTime: string;
  endTime: string;
  activityName: string;
  organizerName: string;
  level: string;
  material: string;
  status: string;
  maxParticipants: number;
  participantNames: string[];
  pendingParticipants: string[];
  acceptedParticipants: string[];
  imageUrl: string;
}

@Component({
  selector: 'app-event-organizer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,

    // ✅ Tous les modules Angular Material nécessaires
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
  ],
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss']
})
export class EventOrganizerComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  loading = true;
  baseUrl = environment.apiUrl;

  event: EventDetails = {
    id: '',
    title: '',
    description: '',
    eventDate: '',
    addressLabel: '',
    startTime: '',
    endTime: '',
    activityName: '',
    organizerName: '',
    level: '',
    material: '',
    status: '',
    maxParticipants: 0,
    participantNames: [],
    pendingParticipants: [],
    acceptedParticipants: [],
    imageUrl: ''
  };

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.http.get<EventDetails>(`${this.baseUrl}/event/${eventId}`).subscribe({
        next: (data) => {
          this.event = {
            ...this.event,
            ...data,
            pendingParticipants: data.pendingParticipants || [],
            acceptedParticipants: data.acceptedParticipants || [],
            participantNames: data.participantNames || [],
          };
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Erreur chargement événement:', err);
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
}
