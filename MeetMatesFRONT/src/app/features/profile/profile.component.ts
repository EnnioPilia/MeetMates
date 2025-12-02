import { Component, signal, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DialogService } from '../../core/services/dialog.service/dialog.service';

import { CguDialogComponent } from '../../shared-components/cgu-dialog/cgu-dialog.component';
import { ProfileCardComponent } from './components/profile-card.component';
import { ParticipationTabComponent } from './components/participation-tab.component';
import { OrganizationTabComponent } from './components/organization-tab.component';
import { SettingsMenuComponent } from './components/settings-menu.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';
import { ProfileFacade } from '../../core/facades/profile/profile.facade';


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
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private profileFacade = inject(ProfileFacade);
  private dialogService = inject(DialogService);

  readonly user = this.profileFacade.user;
  readonly eventsParticipating = this.profileFacade.eventsParticipating;
  readonly eventsOrganized = this.profileFacade.eventsOrganized;
  readonly loading = this.profileFacade.loading;
  readonly error = this.profileFacade.error;

  ngOnInit(): void {
    this.profileFacade.loadProfile();
  }

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

  onEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  openCguDialog(): void {
    this.dialogService.openCgu();
  }

  openMentionsDialog(): void {
    this.dialogService.openMentions();
  }

}

