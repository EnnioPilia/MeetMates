// Angular
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core
import { AdminFacade } from '../../../core/facades/admin/admin.facade';

// Shared
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StateHandlerComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {

  private facade = inject(AdminFacade);

  /** Exposition des states */
  readonly users = this.facade.users;
  readonly events = this.facade.events;
  readonly loading = this.facade.loading;

  ngOnInit(): void {
    this.facade.loadUsers().subscribe();
    this.facade.loadEvents().subscribe();
  }
}
