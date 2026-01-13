// Angular
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Angular Material
import { MatExpansionModule } from '@angular/material/expansion';

// Core (facades, services)
import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';

// Shared components
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { EventHeaderComponent } from '../../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../../shared-components/event-info/event-info.component';

/**
 * Page d’administration des événements.
 *
 * Ce composant affiche la liste des événements
 * et permet aux administrateurs de gérer leur cycle de vie.
 *
 * Responsabilités :
 * - charger la liste des événements via `AdminFacade`
 * - afficher les états (loading, erreur, données)
 * - permettre la suppression logique et définitive des événements
 * - permettre la restauration d’un événement supprimé
 */
@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    CommonModule,
    StateHandlerComponent,
    AppButtonComponent,
    MatExpansionModule,
    EventHeaderComponent,
    EventInfoComponent,
  ],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventsComponent implements OnInit {

  private adminFacade = inject(AdminFacade);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  /** États exposés par la facade */
  readonly events = this.adminFacade.events;
  readonly loading = this.adminFacade.loading;
  readonly error = this.adminFacade.error;

  /** Liste des participants associée à un événement. */
  participants: { id: string; firstName: string; lastName: string }[] = [];

  /** Initialise la page déclenche le chargement des événements */
  ngOnInit(): void {
    this.adminFacade.loadEvents().subscribe();
  }

  /**
   * Supprime un événement de manière logique (soft delete).
   *
   * @param eventId Identifiant de l’événement
   */
  softDeleteEvent(eventId: string): void {
    this.adminFacade.softDeleteEvent(eventId).subscribe();
  }

  /**
   * Restaure un événement précédemment supprimé.
   *
   * @param id Identifiant de l’événement
   */
  restoreEvent(id: string) {
    this.adminFacade.restoreEvent(id).subscribe();
  }

  /**
   * Supprime définitivement un événement après confirmation utilisateur.
   *
   * @param eventId Identifiant de l’événement
   */
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
