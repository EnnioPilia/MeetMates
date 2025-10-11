import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// ✅ Import Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule  } from '@angular/material/divider';


// ==================== INTERFACES ==================== //

interface EventParticipant {
  id: string;               // id du EventUser
  userId: string;           // id du user
  firstName: string;
  lastName: string;
  participationStatus: string;
  role: string;
}

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
  pendingParticipants: EventParticipant[];
  acceptedParticipants: EventParticipant[];
  imageUrl: string;
}

// ==================== COMPONENT ==================== //

@Component({
  selector: 'app-event-organizer',
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
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule
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

  // ==================== INIT ==================== //

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  private loadEvent(eventId: string): void {
    this.http.get<EventDetails>(`${this.baseUrl}/event/${eventId}`).subscribe({
      next: (data) => {
        this.event = {
          ...this.event,
          ...data,
          pendingParticipants: data.pendingParticipants || [],
          acceptedParticipants: data.acceptedParticipants || [],
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement événement:', err);
        this.loading = false;
      }
    });
  }

  // ==================== ACTIONS ==================== //

  acceptParticipant(eventUserId: string) {
    this.http.put(`${this.baseUrl}/event-user/${eventUserId}/accept`, {},{ withCredentials: true }).subscribe({
      next: () => {
        console.log('✅ Participant accepté');
        this.refreshEvent();
      },
      error: (err) => console.error('❌ Erreur acceptation:', err)
    });
  }

  rejectParticipant(eventUserId: string) {
    this.http.put(`${this.baseUrl}/event-user/${eventUserId}/reject`, {} ,{ withCredentials: true }).subscribe({
      next: () => {
        console.log('❌ Participant rejeté');
        this.refreshEvent();
      },
      error: (err) => console.error('❌ Erreur rejet:', err)
    });
  }

  refreshEvent() {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  // ==================== HELPERS ==================== //

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
