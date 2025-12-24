import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
export class AdminEventsComponent {

  private facade = inject(AdminFacade);

  /** États exposés */
  readonly events = this.facade.events;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadEvents().subscribe();
  }

  deleteEvent(eventId: string): void {
    this.facade.deleteEvent(eventId).subscribe({
      complete: () => this.facade.loadEvents().subscribe()
    });
  }
}
