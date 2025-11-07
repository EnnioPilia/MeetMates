import { Component, OnInit, inject, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { EventService } from '../../../core/services/event/event-service.service';
import { EventResponse } from '../../../core/models/event-response.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';
import { EventUserService } from '../../../core/services/event/event-user-service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { UserService } from '../../../core/services/user/user.service';

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
    AppButtonComponent
  ],
})
export class EventListComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private eventService = inject(EventService);
  private destroy$ = new Subject<void>();
  private eventUserService = inject(EventUserService);
  private activityService = inject(ActivityService);
  private userService = inject(UserService);

  loading = true;
  events: EventResponse[] = [];
  activityName = 'TOUT LES ÉVÉNEMENTS';

  @ViewChildren('eventCard') eventCards!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: any) => {
          this.signals.updateCurrentUser(user);
        },
        error: () => {
          this.signals.clearCurrentUser();
        },
      });

    const activityId = this.route.snapshot.paramMap.get('activityId');
    if (activityId) {
      this.loadActivityName(activityId);
      this.loadEventsByActivity(activityId);
    } else {
      this.loadAllEvents();
    }
  }

  ngAfterViewInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const eventId = params['eventId'];
        if (!eventId) return;

        const checkLoaded = setInterval(() => {
          if (!this.loading && this.eventCards?.length > 0) {
            this.scrollToEvent(eventId);
            clearInterval(checkLoaded);
          }
        }, 200);
      });
  }

  scrollToEvent(eventId: string) {
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

    const eventFound = this.events.find(e => e.id === eventId)
      ?? (() => this.notification.showError("L'événement n'a pas été trouvé."))();
    if (!eventFound) return;

    if (['CANCELLED', 'FULL', 'FINISHED'].includes(eventFound.status?.toUpperCase() || ''))
      return this.notification.showWarning("Cet événement n’est plus disponible.");

    this.eventUserService.joinEvent(eventId, user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.notification.showSuccess('Demande de participation envoyée.'),
        error: (err) => {
          const messages: Record<number, string> = {
            409: 'Vous participez déjà à cet événement.',
            410: 'Vous avez été retiré de cette activité.',
            401: 'Vous devez être connecté pour participer.'
          };
          const message = messages[err.status] || 'Une erreur est survenue.';
          this.notification.showError(message);
        }
      });
  }

  loadAllEvents(): void {
    this.loading = true;
    this.eventService.fetchAllEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
          this.updatePageTitle('TOUT LES ÉVÉNEMENTS');
        },
        error: () => {
          this.loading = false;
          this.updatePageTitle('TOUT LES ÉVÉNEMENTS');
        },
      });
  }

  private loadEventsByActivity(activityId: string): void {
    this.loading = true;
    this.eventService.fetchEventsByActivity(activityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  loadActivityName(activityId: string): void {
    this.activityService.fetchActivityById(activityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (activity) => {
          this.activityName = activity.name;
          this.updatePageTitle(activity.name);
        },
        error: () => {
          this.activityName = 'Activité inconnue';
          this.updatePageTitle('Activité inconnue');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getLevelLabel(level: string): string {
    return this.eventService.getLevelLabel(level)
  }

  getMaterialLabel(material: string): string {
    return this.eventService.getMaterialLabel(material);
  }
}
