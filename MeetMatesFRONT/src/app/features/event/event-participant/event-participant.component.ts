import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { EventDetails } from '../../../core/models/event-details.model';
import { EventService } from '../../../core/services/event/event-service.service';
import { EventUserService } from '../../../core/services/event/event-user-service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';
import { EventStatusComponent } from './components/event-status';
import { ParticipantListComponent } from './components/participant-list';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';
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
    AppButtonComponent
  ],
  templateUrl: './event-participant.component.html',
  styleUrls: ['./event-participant.component.scss']
})
export class EventParticipantComponent implements OnInit, OnDestroy {
  private eventUserService = inject(EventUserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private eventService = inject(EventService);
  private destroy$ = new Subject<void>();

  loading = true;
  event?: EventDetails;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) return;

    this.eventService.fetchEventById(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.event = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });
  }

  cancelParticipation(eventId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer l’annulation',
        message: "Êtes-vous sûr de vouloir annuler votre participation ?"
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.eventUserService.leaveEvent(eventId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notification.showSuccess('Votre participation a été annulée avec succès.');
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            const messages: Record<number, string> = {
              401: 'Vous devez être connecté pour annuler votre participation.',
              404: 'Vous ne participez pas à cet événement.',
              410: 'Cet événement n’est plus disponible.'
            };
            const message = messages[err.status] || 'Une erreur est survenue lors de l’annulation.';
            this.notification.showError(message);
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
    return this.eventService.getParticipationLabel(status ?? null);
  }
}
