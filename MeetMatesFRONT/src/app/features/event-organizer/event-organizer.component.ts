import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { EventFacade } from '../../core/facades/event/event.facade';

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
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  private eventFacade = inject(EventFacade);

  event = this.eventFacade.event;
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('eventId');
  if (!id) return;

  this.eventFacade.load(id).pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe();
}


  onAccept(id: string) {
    this.eventFacade.acceptParticipant(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refresh());
  }

  onReject(id: string) {
    this.eventFacade.rejectParticipant(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refresh());
  }

  deleteEvent() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Supprimer l’activité",
        message: "Êtes-vous sûr ?"
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (!confirm) return;

      const id = this.eventFacade.event()?.id;
      if (!id) return;

      this.eventFacade.deleteEvent(id).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.router.navigate(['/profile']));
    });
  }

  refresh() {
    const id = this.route.snapshot.paramMap.get('eventId');
    if (!id) return;

    this.eventFacade.load(id).subscribe();
  }
}