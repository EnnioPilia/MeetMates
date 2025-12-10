import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DialogService } from '../../core/services/dialog.service/dialog.service';
import { EventStatusComponent } from './components/event-status';
import { ParticipantListComponent } from './components/participant-list';
import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

import { getStatusLabel, getLevelLabel, getMaterialLabel, getParticipationLabel } from '../../core/utils/labels.util';
import { EventFacade } from '../../core/facades/events/event/event.facade';

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
    StateHandlerComponent
    ],
  templateUrl: './event-participant.component.html',
  styleUrls: ['./event-participant.component.scss']
})
export class EventParticipantComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  private eventFacade = inject(EventFacade);

  event = this.eventFacade.event;
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('eventId');
    if (!id) return;

    this.eventFacade.load(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  cancelParticipation(eventId: string): void {
  this.dialogService
    .confirm(
      'Confirmer l’annulation',
      "Êtes-vous sûr de vouloir annuler votre participation ?"
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.eventFacade.leave(eventId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.router.navigate(['/profile']));
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
