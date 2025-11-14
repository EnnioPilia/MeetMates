import { Component, OnInit, inject, ElementRef, QueryList, ViewChildren, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SignalsService } from '../../core/services/signals/signals.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventService } from '../../core/services/event/event.service.service';
import { EventResponse } from '../../core/models/event-response.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { EventUserService } from '../../core/services/event-user/event-user.service';
import { ActivityService } from '../../core/services/activity/activity.service';
import { UserService } from '../../core/services/user/user.service';
import { ErrorHandlerService } from '../../core/services/error-handler/error-handler.service';
import { catchError, EMPTY } from 'rxjs';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component'; 
import { getStatusLabel, getLevelLabel, getMaterialLabel } from '../../core/utils/labels.util';

@Component({
  selector: 'app-event-list',
  standalone: true,
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    EventInfoComponent,
    EventHeaderComponent,
    AppButtonComponent,
    LoadingSpinnerComponent
  ],
})
export class EventListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);
  private eventUserService = inject(EventUserService);
  private activityService = inject(ActivityService);
  private userService = inject(UserService);
  private errorHandler = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);
  readonly events = signal<EventResponse[]>([]);

  loading = signal(true);
  error = signal<string | null>(null);

  @ViewChildren('eventCard') eventCards!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: any) => this.signals.updateCurrentUser(user),
        error: (err) => this.errorHandler.handle(err, '❌ Impossible de charger les événements.')
      });

    const activityId = this.route.snapshot.paramMap.get('activityId');
    if (activityId) {
      this.loadActivityName(activityId);
      this.loadEventsByActivity(activityId);
    } else {
      this.loadAllEvents();
    }

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const eventId = params['eventId'];
        if (eventId) this.scrollToEventWhenReady(eventId);
      });
  }

  private scrollToEventWhenReady(eventId: string) {
    const checkLoaded = setInterval(() => {
      if (!this.loading() && this.eventCards?.length > 0) {
        this.scrollToEvent(eventId);
        clearInterval(checkLoaded);
      }
    }, 200);
  }

  private scrollToEvent(eventId: string) {
    const card = this.eventCards.find(el =>
      el.nativeElement.getAttribute('data-id') === eventId
    );
    if (card) {
      card.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.nativeElement.classList.add('highlight');
      setTimeout(() => card.nativeElement.classList.remove('highlight'), 2000);
    }
  }

  joinEvent(eventId: string) {
    const user = this.signals.currentUser();
    if (!user) {
      this.notification.showError('Vous devez être connecté pour participer à un événement.');
      return;
    }

    const eventFound = this.events().find(e => e.id === eventId)!;

    if (eventFound.organizerId === user.id) {
      this.notification.showWarning('Vous êtes l’organisateur de cet événement.');
      return;
    }

    if (['CANCELLED', 'FULL', 'FINISHED'].includes(eventFound.status?.toUpperCase() || '')) {
      this.notification.showWarning("Cet événement n’est plus disponible.");
      return;
    }

    this.eventUserService.joinEvent(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.notification.showSuccess('✅ Demande de participation envoyée.'),
        error: err => {
          if (err?.status === 409) {
            this.notification.showWarning('Une demande a deja été envoyé.');
            return;
          }
          this.errorHandler.handle(err, 'Vous avez été retiré de cet événement.');
        }
      });
  }

  loadAllEvents(): void {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.fetchAllEvents()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Impossible de charger les événements.');
          this.error.set('Impossible de charger les événements.');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(data => {
        this.events.set(data);
        this.loading.set(false);
      });
  }

  private loadEventsByActivity(activityId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.fetchEventsByActivity(activityId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Impossible de charger les événements.');
          this.error.set('Impossible de charger les événements.');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(data => {
        this.events.set(data);
        this.loading.set(false);
      });
  }

  loadActivityName(activityId: string): void {
    this.activityService.fetchActivityById(activityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (activity) => {
          this.updatePageTitle(activity.name);
        },
        error: (err) => {
          this.errorHandler.handle(err, '❌ Impossible de charger les événements.');
          this.updatePageTitle('Activité inconnue');
        },
      });
  }

  private updatePageTitle(title: string): void {
    this.signals.setPageTitle(title);
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  isEventOpen(event: any): boolean {
    return (event?.status ?? '').toUpperCase() === 'OPEN';
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
}
