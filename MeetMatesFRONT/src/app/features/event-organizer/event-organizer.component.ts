import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, catchError } from 'rxjs';

import { EventDetails } from '../../core/models/event-details.model';
import { EventService } from '../../core/services/event/event.service.service';
import { EventUserService } from '../../core/services/event-user/event-user.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler/error-handler.service';

import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { EventTabAcceptedComponent } from './components/event-tab-accepted.component';
import { EventTabPendingComponent } from './components/event-tab-pending.component';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component'; 

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
    AppButtonComponent,
    EventTabAcceptedComponent,
    EventTabPendingComponent,
    MatTabsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss'],
})
export class EventOrganizerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private eventUserService = inject(EventUserService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
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

  onAccept(eventUserId: string): void {
    this.eventUserService.acceptParticipant(eventUserId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notification.showSuccess('✅ Participant accepté avec succès.');
          this.onRefresh();
        },
        error: err => {
          this.errorHandler.handle(err, "❌ Impossible d'accepter ce participant.");
        }
      });
  }

  onReject(eventUserId: string): void {
    this.eventUserService.rejectParticipant(eventUserId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notification.showSuccess('🚫 Participant refusé avec succès.');
          this.onRefresh();
        },
        error: err => {
          this.errorHandler.handle(err, "❌ Impossible de refuser ce participant.");
        }
      });
  }

  deleteEvent(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l’activité',
        message: 'Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.',
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      const currentEvent = this.event();
      if (!currentEvent) return;

      this.eventService.deleteEvent(currentEvent.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.notification.showSuccess('✅ Activité supprimée avec succès.');
            this.router.navigate(['/profile']);
          },
          error: err => {
            this.errorHandler.handle(err, '❌ Impossible de supprimer cette activité.');
          }
        });
    });
  }

  onRefresh(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) this.loadEvent(eventId);
  }
}
