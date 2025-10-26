import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../../../environments/environment';
import { EventDetails } from '../../../core/models/event-details.model';
import { EventService } from '../../../core/services/event/event-service.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';

// ✅ Shared components
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';
import { EventPictureComponent } from '../../../shared-components/event-picture/event-picture.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

// ✅ Organizer-specific component
import { EventParticipantsTabsComponent } from '../../../features/event/event-organizer/components/event-participants-tabs.component';

// ✅ Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-event-organizer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    EventHeaderComponent,
    EventInfoComponent,
    EventPictureComponent,
    AppButtonComponent,
    EventParticipantsTabsComponent
  ],
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss']
})
export class EventOrganizerComponent implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);

  baseUrl = environment.apiUrl;
  loading = true;

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
    participationStatus: null,
    rejectedParticipants: [],
    pendingParticipants: [],
    acceptedParticipants: [],
    imageUrl: ''
  };

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  private loadEvent(eventId: string): void {
    this.loading = true;
    this.http.get<EventDetails>(`${this.baseUrl}/event/${eventId}`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.event = { ...this.event, ...data };
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement événement:', err);
        this.loading = false;
      }
    });
  }

  /** ✅ Acceptation d’un participant */
  acceptParticipant(eventUserId: string): void {
    this.http.put(`${this.baseUrl}/event-user/${eventUserId}/accept`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.notification.showSuccess('Participant accepté avec succès.');
        this.refreshEvent();
      },
      error: (err) => console.error('❌ Erreur acceptation participant:', err)
    });
  }

  /** ✅ Refus d’un participant */
  rejectParticipant(eventUserId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer le refus',
        message: 'Êtes-vous sûr de vouloir refuser ce participant ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.put(`${this.baseUrl}/event-user/${eventUserId}/reject`, {}, { withCredentials: true }).subscribe({
        next: () => {
          this.notification.showSuccess('Participant refusé avec succès.');
          this.refreshEvent();
        },
        error: (err) => console.error('❌ Erreur refus participant:', err)
      });
    });
  }

  /** ✅ Retrait d’un participant */
  removeParticipant(eventId: string, userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Retirer le participant',
        message: 'Êtes-vous sûr de vouloir retirer cette personne de l’événement ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.delete(`${this.baseUrl}/event-user/${eventId}/remove/${userId}`, { withCredentials: true }).subscribe({
        next: () => {
          this.notification.showSuccess('Participant retiré avec succès.');
          this.refreshEvent();
        },
        error: (err) => console.error('❌ Erreur retrait participant:', err)
      });
    });
  }

  confirmDeleteEvent(eventId: string): void {
    if (!eventId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l’activité',
        message: 'Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.delete(`${this.baseUrl}/event/${eventId}`, { withCredentials: true }).subscribe({
        next: () => {
          this.notification.showSuccess('Activité supprimée avec succès.');
          window.location.href = '/events';
        },
        error: (err) => {
          console.error('❌ Erreur suppression activité:', err);
          this.notification.showError('Impossible de supprimer cette activité.');
        }
      });
    });
  }

  /** 🔄 Recharge les données */
  refreshEvent(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  /** ✅ Helpers de labels (traductions) */
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
