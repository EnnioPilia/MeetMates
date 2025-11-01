import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventService } from '../../core/services/event/event-service.service';
import { AppInputComponent } from '../../shared-components/input/input.component';
import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { EventDetails } from '../../core/models/event-details.model';
import { RouterModule } from '@angular/router';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { EventUserService } from '../../core/services/event/event-user-service';
import { SignalsService } from '../../core/services/signals/signals.service'; // ton currentUser
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppInputComponent,
    EventInfoComponent,
    EventHeaderComponent,
    RouterModule,
    AppButtonComponent,
  ],
  templateUrl: './search-events.component.html',
})
export class SearchEventsComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private eventUserService = inject(EventUserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private destroy$ = new Subject<void>();

  form: FormGroup = this.fb.group({
    query: [''],
  });

  results = signal<EventDetails[]>([]);
  loading = signal(false);

  constructor() {
    this.form.controls['query'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (!query || query.trim().length === 0) {
            this.results.set([]);
            return [];
          }

          this.loading.set(true);
          return this.eventService.searchEvents(query.trim());
        })
      )
      .subscribe({
        next: (events) => {
          this.results.set(events);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  joinEvent(eventId: string) {
    const user = this.signals.currentUser();
    if (!user) {
      this.notification.showError('Vous devez être connecté pour participer à un événement.');
      return;
    }

    this.eventUserService.joinEvent(eventId, user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.notification.showSuccess('Demande de participation envoyée.'),
        error: (err) => {
          if (err.status === 409) {
            this.notification.showWarning('Vous participez déjà à cet événement.');
          } else if (err.status === 410) {
            this.notification.showError('Vous avez été retiré de cette activité.');
          } else if (err.status === 401) {
            this.notification.showError('Vous devez être connecté pour participer.');
          } else {
            this.notification.showError('Une erreur est survenue.');
          }
        }
      });
  }

  trackById(index: number, item: EventDetails) {
    return item.id;
  }
}
