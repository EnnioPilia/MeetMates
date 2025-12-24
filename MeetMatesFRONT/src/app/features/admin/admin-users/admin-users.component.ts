import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    StateHandlerComponent,
    AppButtonComponent
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent {

  private facade = inject(AdminFacade);
  
  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadUsers().subscribe();
  }

  deleteUser(userId: string): void {
    this.facade.deleteUser(userId).subscribe({
      complete: () => this.facade.loadUsers().subscribe()
    });
  }
}
