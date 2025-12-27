import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    CommonModule,
    StateHandlerComponent,
    AppButtonComponent
  ],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventsComponent implements OnInit {

  private adminFacade = inject(AdminFacade);

  readonly events = this.adminFacade.events;
  readonly loading = this.adminFacade.loading;
  readonly error = this.adminFacade.error;

  ngOnInit(): void {
    this.adminFacade.loadEvents().subscribe();
  }

  /** Soft delete événement */
  softDeleteEvent(eventId: string): void {
    this.adminFacade.softDeleteEvent(eventId).subscribe();
  }

  /** Hard delete événement (optionnel) */
  hardDeleteEvent(eventId: string): void {
    this.adminFacade.hardDeleteEvent(eventId).subscribe();
  }

  restoreEvent(id: string) {
  this.adminFacade.restoreEvent(id).subscribe();
}
}
