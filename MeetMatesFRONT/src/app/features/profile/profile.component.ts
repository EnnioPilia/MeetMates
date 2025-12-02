import { Component, signal, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { CguDialogComponent } from '../../shared-components/cgu-dialog/cgu-dialog.component';
import { ProfileCardComponent } from './components/profile-card.component';
import { ParticipationTabComponent } from './components/participation-tab.component';
import { OrganizationTabComponent } from './components/organization-tab.component';
import { SettingsMenuComponent } from './components/settings-menu.component';
import { StateHandlerComponent } from '../../shared-components/state-handler.component/state-handler.component';
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

  readonly user = this.profileFacade.user;
  readonly eventsParticipating = this.profileFacade.eventsParticipating;
  readonly eventsOrganized = this.profileFacade.eventsOrganized;
  readonly loading = this.profileFacade.loading;
  readonly error = this.profileFacade.error;

  ngOnInit(): void {
    this.profileFacade.loadProfile();
  }

  onLogout(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Déconnexion',
        message: 'Voulez-vous vraiment vous déconnecter ?'
      }
    })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.profileFacade.logout().subscribe();
        }
      });
  }

  onDeleteAccount(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression du compte',
        message: 'Voulez-vous vraiment supprimer définitivement votre compte ?'
      }
    })
      .afterClosed()
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
    this.dialog.open(CguDialogComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: 'cgu' }
    });
  }

  openMentionsDialog(): void {
    this.dialog.open(CguDialogComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: 'mentions' }
    });
  }
}

