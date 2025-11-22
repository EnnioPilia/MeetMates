import { Component, signal, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserService } from '../../core/services/user/user.service';
import { EventUserService } from '../../core/services/event-user/event-user.service';
import { SignalsService } from '../../core/services/signals/signals.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler/error-handler.service';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { CguDialogComponent } from '../../shared-components/cgu-dialog/cgu-dialog.component';
import { ProfileCardComponent } from '../profile/components/profile-card.component';
import { ParticipationTabComponent } from '../profile/components/participation-tab.component';
import { OrganizationTabComponent } from '../profile/components/organization-tab.component';
import { SettingsMenuComponent } from '../profile/components/settings-menu.component';
import { LoadingSpinnerComponent } from '../../shared-components/loading-spinner/loading-spinner.component';
import { EventResponse } from '../../core/models/event-response.model';
import { User } from '../../core/models/user.model';
import { AuthFacade } from '../../core/facades/auth/auth.facade';
import { UserFacade } from '../../core/facades/user/user.facade';

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
    LoadingSpinnerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private eventUserService = inject(EventUserService);
  private signals = inject(SignalsService);
  private errorHandler = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);
  private authFacade = inject(AuthFacade);
  private userFacade = inject(UserFacade); 

  readonly user = signal<User | null>(null);
  readonly eventsParticipating = signal<EventResponse[]>([]);
  readonly eventsOrganized = signal<EventResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.loading.set(true);
    this.userService.getCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Impossible de charger le profil utilisateur.');
          this.error.set('Profil introuvable.');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(user => {
        this.user.set(user);
        this.signals.updateCurrentUser(user);
        this.fetchEvents();
      });
  }

  private fetchEvents(): void {
    forkJoin({
      organized: this.eventUserService.getOrganizedEvents(),
      participating: this.eventUserService.getParticipatingEvents()
    }).subscribe(({ organized, participating }) => {

      const organizedIds = new Set(organized.map(e => e.eventId ?? e.id));
      const filteredParticipating = participating.filter(e => !organizedIds.has(e.eventId ?? e.id));

      this.eventsOrganized.set(organized);
      this.eventsParticipating.set(filteredParticipating);
      this.loading.set(false);

    });
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Déconnexion', message: 'Voulez-vous vraiment vous déconnecter ?' }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.authFacade.logout().pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      });
  }


  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Suppression du compte', message: 'Voulez-vous vraiment supprimer définitivement votre compte ? Cette action est irréversible.' }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.userFacade.deleteMyAccount().pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      });
  }

  get eventsParticipatingArray(): EventResponse[] {
    return this.eventsParticipating();
  }

  get eventsOrganizedArray(): EventResponse[] {
    return this.eventsOrganized();
  }

  openCguDialog(): void {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false, data: { type: 'cgu' } });
  }

  openMentionsDialog(): void {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false, data: { type: 'mentions' } });
  }

  onEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }
}
