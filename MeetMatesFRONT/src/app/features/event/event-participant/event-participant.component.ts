import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { EventDetails } from '../../../core/models/event-details.model';
import { EventResponse } from '../../../core/models/event-response.model';
import { EventService } from '../../../core/services/event/event-service.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';
import { EventStatusComponent } from './components/event-status';
import { ParticipantListComponent } from './components/participant-list';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';
import { EventPictureComponent } from '../../../shared-components/event-picture/event-picture.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-event-participant',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    EventStatusComponent,
    ParticipantListComponent,
    EventHeaderComponent,
    EventInfoComponent,
    EventPictureComponent,
    AppButtonComponent
  ],
  templateUrl: './event-participant.component.html',
  styleUrls: ['./event-participant.component.scss']
})
export class EventParticipantComponent implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private eventService = inject(EventService);
  loading = true;
  event?: EventDetails;
  baseUrl = environment.apiUrl;
  events: EventResponse[] = [];

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.http.get<EventDetails>(`${this.baseUrl}/event/${eventId}`, { withCredentials: true })
        .subscribe({
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

  cancelParticipation(eventId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmer l’annulation', message: "Êtes-vous sûr de vouloir annuler votre participation ?" }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.http.delete(`${this.baseUrl}/event-user/leave`, {
        params: { eventId },
        withCredentials: true,
        responseType: 'text'
      }).subscribe({
        next: () => {
          this.notification.showSuccess('Votre participation a été annulée avec succès.');
          this.fetchAllEvents();
        },
        error: (err) => {
          console.error('Erreur lors de l’annulation :', err);

          if (err.status === 401) {
            this.notification.showError('Vous devez être connecté pour annuler votre participation.');
          } else if (err.status === 404) {
            this.notification.showWarning('Vous ne participez pas à cet événement.');
          } else {
            this.notification.showError('Une erreur est survenue lors de l’annulation.');
          }
        }
      });
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

  private updatePageTitle(title: string) {
    this.signals.setPageTitle(title);
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
    return this.eventService.getParticipationLabel(status ?? null);
  }
}
