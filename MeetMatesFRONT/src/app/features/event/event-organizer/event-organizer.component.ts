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
import { MatDividerModule } from '@angular/material/divider';
import { EventDetails } from '../../../core/models/event-details.model';
import { EventService } from '../../../core/services/event/event-service.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-organizer',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatTabsModule, MatExpansionModule, MatDividerModule],
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss']
})
export class EventOrganizerComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);

  private baseUrl = environment.apiUrl;

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

  acceptParticipant(eventUserId: string) {
    this.http.put(`${this.baseUrl}/event-user/${eventUserId}/accept`, {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log('✅ Participant accepté');
        this.refreshEvent();
      },
      error: (err) => console.error('❌ Erreur acceptation:', err)
    });
  }

  rejectParticipant(eventUserId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer le refus',
        message: 'Êtes-vous sûr de vouloir refuser ce participant ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.put(
        `${this.baseUrl}/event-user/${eventUserId}/reject`,
        {},
        { withCredentials: true }
      ).subscribe({
        next: () => {
          this.notification.showSuccess('Participant refusé avec succès.');
          this.refreshEvent();
        },
        error: (err) => console.error('❌ Erreur rejet:', err)
      });
    });
  }

  removeParticipant(eventId: string, userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Retirer le participant',
        message: 'Êtes-vous sûr de vouloir retirer cette personne de l’événement ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.delete(
        `${this.baseUrl}/event-user/${eventId}/remove/${userId}`,
        { withCredentials: true, responseType: 'text' }
      ).subscribe({
        next: () => {
          this.notification.showSuccess('✅ Le participant a été retiré avec succès.');
          this.refreshEvent(); // 🔄 Recharge les données après suppression
        },
        error: (err) => {
          console.error('❌ Erreur lors du retrait du participant :', err);

          if (err.status === 401) {
            this.notification.showError('Vous devez être connecté pour effectuer cette action.');
          } else if (err.status === 403) {
            this.notification.showWarning('Seul l’organisateur peut retirer un participant.');
          } else if (err.status === 404) {
            this.notification.showWarning('Le participant n’a pas été trouvé dans cet événement.');
          } else if (err.status === 409) {
            this.notification.showWarning('Impossible de retirer l’organisateur.');
          } else {
            this.notification.showError('Une erreur est survenue lors du retrait du participant.');
          }
        }
      });
    });
  }

  refreshEvent() {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  confirmDeleteEvent(eventId?: string): void {
    if (!eventId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.delete(`${this.baseUrl}/event/${eventId}`, { withCredentials: true })
        .subscribe({
          next: () => {
            this.notification.showSuccess('Activité supprimée avec succès.');
            window.location.href = '/events';
          },
          error: (err) => {
            console.error('Erreur suppression activité :', err);
            if (err.status === 403) {
              this.notification.showError('Vous n’êtes pas autorisé à supprimer cette activité.');
            } else {
              this.notification.showError('Une erreur est survenue lors de la suppression.');
            }
          }
        });
    });
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
