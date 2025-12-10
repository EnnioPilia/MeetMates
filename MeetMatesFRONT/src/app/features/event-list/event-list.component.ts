import {
  Component,
  OnInit,
  inject,
  ElementRef,
  QueryList,
  ViewChildren,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EventListFacade } from '../../core/facades/events/event-list/event-list.facade';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

import { EventResponse } from '../../core/models/event-response.model';
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
    EventHeaderComponent,
    EventInfoComponent,
    AppButtonComponent,
    StateHandlerComponent
  ]
})
export class EventListComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private eventListFacade = inject(EventListFacade);
  private destroyRef = inject(DestroyRef);

  readonly events = this.eventListFacade.events;
  readonly loading = this.eventListFacade.loading;
  readonly error = this.eventListFacade.error;

  @ViewChildren('eventCard') eventCards!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.eventListFacade.loadCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {

        const activityId = this.route.snapshot.paramMap.get('activityId');

        if (activityId) {
          this.eventListFacade.loadActivityName(activityId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();

          this.eventListFacade.loadEventsByActivity(activityId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        } else {
          this.eventListFacade.loadAllEvents()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const eventId = params['eventId'];
        if (eventId) this.scrollToEventWhenReady(eventId);
      });
  }


  joinEvent(eventId: string) {
    this.eventListFacade.joinEvent(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
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

  getStatusLabel(status?: string) {
    return status ? getStatusLabel(status) : '';
  }

  getLevelLabel(level?: string) {
    return level ? getLevelLabel(level) : '';
  }

  getMaterialLabel(material?: string) {
    return material ? getMaterialLabel(material) : '';
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  isEventOpen(event: EventResponse): boolean {
    return (event.status ?? '').toUpperCase() === 'OPEN';
  }
}
