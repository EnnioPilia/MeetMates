// Angular
import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Core (facades, services)
import { DialogService } from '../../core/services/dialog.service/dialog.service';
import { ProfileFacade } from '../../core/facades/profile/profile.facade';

// Feature components
import { ProfileCardComponent } from './components/profile-card.component';
import { ParticipationTabComponent } from './components/participation-tab.component';
import { OrganizationTabComponent } from './components/organization-tab.component';
import { SettingsMenuComponent } from './components/settings-menu.component';

// Shared components
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

/**
 * Composant parent de la page Profil utilisateur.
 *
 * Responsabilités :
 * - charger les informations du profil utilisateur connecté
 * - exposer les événements :
 *   - auxquels l’utilisateur participe
 *   - qu’il organise
 * - gérer les actions globales du profil :
 *   - édition du profil
 *   - déconnexion
 *   - suppression du compte
 *   - affichage des CGU et mentions légales
 *
 * Architecture :
 * - `ProfileCardComponent` : affichage des informations utilisateur
 * - `ParticipationTabComponent` : événements auxquels l’utilisateur participe
 * - `OrganizationTabComponent` : événements organisés par l’utilisateur
 * - `SettingsMenuComponent` : menu des actions du profil
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ProfileCardComponent,
    ParticipationTabComponent,
    OrganizationTabComponent,
    SettingsMenuComponent,
    StateHandlerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private profileFacade = inject(ProfileFacade);
  private dialogService = inject(DialogService);

  /** États exposés par la facade */
  readonly user = this.profileFacade.user;
  readonly eventsParticipating = this.profileFacade.eventsParticipating;
  readonly eventsOrganized = this.profileFacade.eventsOrganized;
  readonly loading = this.profileFacade.loading;
  readonly error = this.profileFacade.error;

  /** Initialise le composant - déclenche le chargement des données du profil */
  ngOnInit() {
    this.profileFacade.loadProfile().subscribe();
  }

  /** Déconnecte l’utilisateur après confirmation. */
  onLogout(): void {
    this.dialogService
      .confirm('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.profileFacade.logout().subscribe();
        }
      });
  }
  
  /** Supprime définitivement le compte utilisateur après confirmation. */
  onDeleteAccount(): void {
    this.dialogService
      .confirm('Suppression du compte', 'Voulez-vous vraiment supprimer définitivement votre compte ?')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.profileFacade.deleteAccount().subscribe();
        }
      });
  }

  /** Redirige vers la page d’édition du profil. */
  onEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  /** Ouvre la modale des conditions générales d’utilisation. */
  openCguDialog(): void {
    this.dialogService.openCgu();
  }

  /** Ouvre la modale des mentions légales. */
  openMentionsDialog(): void {
    this.dialogService.openMentions();
  }

}

