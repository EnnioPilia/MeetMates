import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, StateHandlerComponent],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventsComponent {

  private facade = inject(AdminFacade);

  readonly events = this.facade.events;
  readonly loading = this.facade.loading;

  ngOnInit(): void {
    this.facade.loadEvents().subscribe();
  }

  deleteEvent(eventId: string): void {
    this.facade.deleteEvent(eventId).subscribe({
      complete: () => this.facade.loadEvents().subscribe()
    });
  }
}
