// Angular
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Core
import { AdminFacade } from '../../../core/facades/admin/admin.facade';

// Shared
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppButtonComponent,
    StateHandlerComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {

  private facade = inject(AdminFacade);
  private router = inject(Router);

  readonly users = this.facade.users;
  readonly events = this.facade.events;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadUsers().subscribe();
    this.facade.loadEvents().subscribe();
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
