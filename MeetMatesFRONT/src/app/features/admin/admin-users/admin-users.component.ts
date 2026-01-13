// Angular
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Core (facades, services)
import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';

// Shared components
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

/**
 * Page d’administration des utilisateurs.
 *
 * Ce composant permet aux administrateurs
 * de gérer les comptes utilisateurs de l’application.
 *
 * Responsabilités :
 * - charger la liste des utilisateurs via `AdminFacade`
 * - exposer les états (loading, erreur, données)
 * - permettre la suppression logique et définitive des utilisateurs
 * - permettre la restauration d’un utilisateur supprimé
 */
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

  /** États exposés par la facade */
  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  /** Initialise la page  déclenche le chargement des utilisateurs */
  ngOnInit(): void {
    this.facade.loadUsers().subscribe(() => {
      console.log(this.users());
    });
  }

  /**
   * Supprime un utilisateur de manière logique (soft delete).
   *
   * @param userId Identifiant de l’utilisateur
   */
  softDeleteUser(userId: string): void {
    this.facade.softDeleteUser(userId).subscribe();
  }
  
  /**
   * Restaure un utilisateur précédemment supprimé.
   *
   * @param userId Identifiant de l’utilisateur
   */
  restoreUser(userId: string): void {
    this.facade.restoreUser(userId).subscribe();
  }

  /**
   * Supprime définitivement un utilisateur après confirmation utilisateur.
   *
   * @param userId Identifiant de l’utilisateur
   */
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
