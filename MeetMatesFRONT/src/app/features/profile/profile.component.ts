import { Component, signal, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserService } from '../../core/services/user/user.service';
import { EventUserService } from '../../core/services/event/event-user-service';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { ProfileCardComponent } from '../profile/components/profile-card.component';
import { ParticipationTabComponent } from '../profile/components/participation-tab.component';
import { OrganizationTabComponent } from '../profile/components/organization-tab.component';
import { SettingsMenuComponent } from '../profile/components/settings-menu.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CguDialogComponent } from '../../shared-components/cgu-dialog/cgu-dialog.component';
import { SignalsService } from '../../core/services/signals/signals.service';
import { NotificationService } from '../../core/services/notification/notification.service';

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
    SettingsMenuComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private eventUserService = inject(EventUserService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);

  readonly user = signal<any>(null);
  readonly eventsParticipating = signal<any[]>([]);
  readonly eventsOrganized = signal<any[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.loading.set(true);

    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.signals.updateCurrentUser(user);
          this.fetchEvents();
        },
        error: () => {
          this.error.set('Erreur lors du chargement du profil.');
          this.notification.showError('❌ Impossible de charger le profil utilisateur.');
          this.loading.set(false);
        }
      });
  }

  private fetchEvents(): void {
    forkJoin({
      organized: this.getOrganizedEvents(),
      participating: this.getParticipatingEvents()
    }).subscribe({
      next: ({ organized, participating }) => {

        const organizedIds = new Set(organized.map(e => e.eventId || e.id));
        const filteredParticipating = participating.filter(e => !organizedIds.has(e.eventId || e.id));

        this.eventsOrganized.set(organized);
        this.eventsParticipating.set(filteredParticipating);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des événements.');
        this.notification.showError('❌ Impossible de charger vos événements.');
        this.loading.set(false);
      }
    });
  }

  private getOrganizedEvents() {
    return this.eventUserService.getOrganizedEvents();
  }

  private getParticipatingEvents() {
    return this.eventUserService.getParticipatingEvents();
  }

  onEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  openCguDialog(): void {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false, data: { type: 'cgu' } });
  }

  openMentionsDialog(): void {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false, data: { type: 'mentions' } });
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Déconnexion', message: 'Voulez-vous vraiment vous déconnecter ?' }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.authService.logout()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.signals.clearCurrentUser();
                this.router.navigate(['/login']);
              },
              error: (err) => {
                this.notification.showError(
                  err?.error?.message || '❌ Une erreur est survenue lors de la déconnexion.'
                );
              }
            });
        }
      });
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression du compte',
        message: 'Voulez-vous vraiment supprimer définitivement votre compte ? Cette action est irréversible.'
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.userService.deleteMyAccount()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.notification.showSuccess('✅ Votre compte a été supprimé avec succès.');
              this.signals.clearCurrentUser();
              this.router.navigate(['/login']);
            },
            error: (err) => {
              this.notification.showError(
                err?.error?.message || '❌ Une erreur est survenue lors de la suppression du compte.'
              );
            }
          });
      });
  }

  refreshData(): void {
    this.fetchEvents();
  }
}

