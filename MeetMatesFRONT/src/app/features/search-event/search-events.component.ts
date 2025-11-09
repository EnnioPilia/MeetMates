import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../core/services/event/event-service.service';
import { EventMapperService } from '../../core/services/event/event-mapper.service';
import { EventDetails } from '../../core/models/event-details.model';
import { EventResponse } from '../../core/models/event-response.model';
import { AppInputComponent } from '../../shared-components/input/input.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventCardComponent } from '../../features/search-event/components/event-card-component';
import { NotificationService } from '../../core/services/notification/notification.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-events',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppInputComponent,
    RouterModule,
    EventCardComponent,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './search-events.component.html',
})
export class SearchEventsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private eventMapper = inject(EventMapperService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private notification = inject(NotificationService);

  form: FormGroup = this.fb.group({
    query: [''],
  });

  results = signal<EventDetails[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.form.controls['query'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (!query?.trim()) {
            this.results.set([]);
            return of([] as EventResponse[]);
          }

          this.loading.set(true);
          return this.eventService.searchEvents(query.trim());
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (responses: EventResponse[]) => {
          const mapped = this.eventMapper.toEventDetailsList(responses);
          this.results.set(mapped);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.notification.showError("Erreur lors de la recherche des événements.");
        }
      });
  }

  goToEventDetails(event: EventDetails) {
    if (event.activityId) {
      this.router.navigate(
        ['/events', event.activityId],
        { queryParams: { eventId: event.id } }
      );
    }
  }

  trackById(index: number, item: EventDetails) {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
