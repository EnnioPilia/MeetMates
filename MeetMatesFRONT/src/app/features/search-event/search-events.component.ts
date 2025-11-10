import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component';

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
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './search-events.component.html',
  styleUrls: ['./search-events.component.scss'],
})
export class SearchEventsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private eventMapper = inject(EventMapperService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  results = signal<EventDetails[]>([]);
  loadingSearch = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    query: [''],
  });

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
          this.loadingSearch.set(true);
          return this.eventService.searchEvents(query.trim());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (responses: EventResponse[]) => {
          const mapped = this.eventMapper.toEventDetailsList(responses);
          this.results.set(mapped);
          this.loadingSearch.set(false);
          this.error.set(null);

        },
        error: () => {
          this.loadingSearch.set(false);
          this.error.set("Impossible de charger les événements.");
          this.notification.showError("Erreur lors de la recherche des événements.");
        }
      });
  }

  goToEventDetails(event: EventDetails) {
    if (event.activityId) {
      this.router.navigate(['/events', event.activityId], {
        queryParams: { eventId: event.id }
      });
    }
  }

  trackById(index: number, item: EventDetails) {
    return item.id;
  }
}
