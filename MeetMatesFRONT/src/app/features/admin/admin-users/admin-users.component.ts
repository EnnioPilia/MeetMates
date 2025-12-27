import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
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
export class AdminUsersComponent implements OnInit {

  private facade = inject(AdminFacade);

  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

ngOnInit(): void {
  this.facade.loadUsers().subscribe(() => {
    console.log(this.users());
  });
}

  /** Soft delete utilisateur */
  softDeleteUser(userId: string): void {
    this.facade.softDeleteUser(userId).subscribe();
  }

  /** Hard delete utilisateur (optionnel) */
  hardDeleteUser(userId: string): void {
    this.facade.hardDeleteUser(userId).subscribe();
  }
  restoreUser(userId: string): void {
  this.facade.restoreUser(userId).subscribe();
}
}
