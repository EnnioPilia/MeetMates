import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';
@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    CommonModule,
    StateHandlerComponent,
    AppButtonComponent,
    MatExpansionModule,
    EventHeaderComponent,
    EventInfoComponent
  ],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventsComponent implements OnInit {

  private adminFacade = inject(AdminFacade);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  readonly events = this.adminFacade.events;
  readonly loading = this.adminFacade.loading;
  readonly error = this.adminFacade.error;

  ngOnInit(): void {
    this.adminFacade.loadEvents().subscribe();
  }

  softDeleteEvent(eventId: string): void {
    this.adminFacade.softDeleteEvent(eventId).subscribe();
  }

  restoreEvent(id: string) {
    this.adminFacade.restoreEvent(id).subscribe();
  }

  hardDeleteEvent(eventId: string): void {
    this.dialogService
      .confirm(
        'Suppression définitive',
        'Cette action est irréversible. Voulez-vous vraiment supprimer cet événement ?'
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (!confirmed) return;

        this.adminFacade.hardDeleteEvent(eventId).subscribe();
      });
  }


}
