// Angular
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

// Core (facades, services)
import { EventFacade } from '../../core/facades/events/event/event.facade';
import { DialogService } from '../../core/services/dialog.service/dialog.service';
import { ProfileFacade } from '../../core/facades/profile/profile.facade';

// Feature components
import { EventTabAcceptedComponent } from './components/event-tab-accepted.component';
import { EventTabPendingComponent } from './components/event-tab-pending.component';

// Shared components
import { EventHeaderComponent } from '../../shared-components/event-header/event-header.component';
import { EventInfoComponent } from '../../shared-components/event-info/event-info.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';


/**
 * Composant parent chargé de la gestion d’un événement
 * côté organisateur.
 *
 * Responsabilités :
 * - récupérer l’identifiant de l’événement depuis la route
 * - charger les données complètes de l’événement via `EventFacade`
 * - exposer les états (événement, chargement, erreur) à la vue
 * - orchestrer les actions d’organisation :
 *   - acceptation / refus des participants
 *   - suppression de l’événement
 * - gérer la navigation post-action (retour profil)
 *
 * Architecture :
 * - `EventTabAcceptedComponent` : affichage des participants acceptés
 * - `EventTabPendingComponent` : affichage des demandes en attente
 * - `EventHeaderComponent` / `EventInfoComponent` : présentation des informations
 */
@Component({
  selector: 'app-event-organizer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    EventHeaderComponent,
    EventInfoComponent,
    AppButtonComponent,
    EventTabAcceptedComponent,
    EventTabPendingComponent,
    MatTabsModule,
    StateHandlerComponent
  ],
  templateUrl: './event-organizer.component.html',
  styleUrls: ['./event-organizer.component.scss'],
})
export class EventOrganizerComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private eventFacade = inject(EventFacade);
  private profileFacade = inject(ProfileFacade);

  /** États exposés par la facade */
  event = this.eventFacade.event;
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

  /**
   * Initialise le composant.
   *
   * - récupère l’identifiant de l’événement depuis la route
   * - déclenche le chargement de l’événement via la facade
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('eventId');
    if (!id) return;

    this.eventFacade.load(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }


  onAccept(id: string) {
    this.eventFacade.acceptParticipant(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refresh());
  }

  onReject(id: string) {
    this.eventFacade.rejectParticipant(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refresh());
  }

  /**
   * Supprime l’événement après confirmation utilisateur.
   *
   * - ouvre une boîte de dialogue de confirmation
   * - déclenche la suppression via la facade
   * - redirige vers le profil après succès
   */
  deleteEvent() {
    this.dialogService
      .confirm("Supprimer l’activité", "Êtes-vous sûr ?")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (!confirmed) return;

        const id = this.eventFacade.event()?.id;
        if (!id) return;

        this.eventFacade.deleteEvent(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.profileFacade.loadProfile().subscribe();
            this.router.navigate(['/profile']);
          });
      });
  }


  /**
   * Recharge les données de l’événement courant.
   * Utilisé après une action modifiant l’état des participants.
   */
  refresh() {
    const id = this.route.snapshot.paramMap.get('eventId');
    if (!id) return;

    this.eventFacade.load(id).subscribe();
  }
}