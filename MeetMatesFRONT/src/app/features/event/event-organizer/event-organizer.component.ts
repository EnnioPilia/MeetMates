import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventDetails } from '../../../core/models/event-details.model';
import { EventService } from '../../../core/services/event/event-service.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventRequestsTabsComponent } from './components/event-requests-tabs';
import { EventOrganizerActionsComponent } from './components/event-organizer-actions.component';
import { EventOrganizerInfoComponent } from './components/event-organizer-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-organizer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    EventHeaderComponent,
    EventRequestsTabsComponent,
    EventOrganizerActionsComponent,
    EventOrganizerInfoComponent,
  ],
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss'],
})
export class EventOrganizerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  loading = true;
  event!: EventDetails;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  private loadEvent(eventId: string): void {
    this.loading = true;
    this.eventService.getEventById(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.event = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onAccept(eventUserId: string): void {
    this.eventService.acceptParticipant(eventUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Participant accepté avec succès.');
          this.onRefresh();
        },
        error: () => {
          this.notification.showError("Impossible d'accepté ce participant.");
        },
      });
  }

  onReject(eventUserId: string): void {
    this.eventService.rejectParticipant(eventUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Participant refusé avec succès.');
          this.onRefresh();
        },
        error: () => {
          this.notification.showError('Impossible de refusé ce participant.');
        },
      });
  }

  onRemove(eventUserId: string): void {
    const eventId = this.event.id;
    if (!eventId || !eventUserId) return;

    this.eventService.removeParticipant(eventId, eventUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Participant retiré avec succès.');
          this.onRefresh();
        },
        error: () => {
          this.notification.showError('Impossible de retiré ce participant.');
        },
      });
  }

  onDeleteEvent(eventId: string): void {
    this.eventService.deleteEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Activité supprimée avec succès.');
          this.router.navigate(['/profile']);
        },
        error: () => {
          this.notification.showError('Impossible de supprimer cette activité.');
        },
      });
  }

  onRefresh(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) this.loadEvent(eventId);
  }
}
