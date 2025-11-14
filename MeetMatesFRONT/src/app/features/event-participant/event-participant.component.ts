import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';

import { EventDetails } from '../../core/models/event-details.model';
import { EventService } from '../../core/services/event/event.service.service';
import { EventUserService } from '../../core/services/event-user/event-user.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler/error-handler.service';

import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { EventStatusComponent } from './components/event-status';
import { ParticipantListComponent } from './components/participant-list';
import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component';
import { getStatusLabel, getLevelLabel, getMaterialLabel, getParticipationLabel } from '../../core/utils/labels.util';

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
    AppButtonComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './event-participant.component.html',
  styleUrls: ['./event-participant.component.scss']
})
export class EventParticipantComponent implements OnInit {
  private eventService = inject(EventService);
  private eventUserService = inject(EventUserService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  error = signal<string | null>(null);
  event = signal<EventDetails | null>(null);

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    } else {
      this.error.set("Événement introuvable.");
      this.loading.set(false);
    }
  }

  private loadEvent(eventId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.fetchEventById(eventId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Impossible de charger cet événement.');
          this.error.set("Événement introuvable ou supprimé.");
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(eventData => {
        this.event.set(eventData);
        this.loading.set(false);
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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notification.showSuccess('✅ Votre participation a été annulée avec succès.');
            this.router.navigate(['/profile']);
          },
          error: (err) => this.errorHandler.handle(err, '❌ Impossible de charger cet événement.')
        });
    });
  }

  getStatusLabel(status?: string): string {
    return status ? getStatusLabel(status) : '';
  }

  getLevelLabel(level?: string): string {
    return level ? getLevelLabel(level) : '';
  }

  getMaterialLabel(material?: string): string {
    return material ? getMaterialLabel(material) : '';
  }

  getParticipationLabel(status: string | null | undefined): string {
    return getParticipationLabel(status ?? null);
  }
}
