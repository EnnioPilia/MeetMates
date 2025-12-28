import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';


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
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadUsers().subscribe(() => {
      console.log(this.users());
    });
  }

  softDeleteUser(userId: string): void {
    this.facade.softDeleteUser(userId).subscribe();
  }

  restoreUser(userId: string): void {
    this.facade.restoreUser(userId).subscribe();
  }

  hardDeleteUser(userId: string): void {
    this.dialogService
      .confirm(
        'Suppression définitive',
        'Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?'
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (!confirmed) return;

        this.facade.hardDeleteUser(userId).subscribe();
      });
  }

}
