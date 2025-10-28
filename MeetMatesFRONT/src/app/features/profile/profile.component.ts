import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserService } from '../../core/services/user/user.service';
import { ConfirmDialogComponent } from '../../shared-components/confirm-dialog/confirm-dialog.component';
import { ProfileCardComponent } from '../profile/components/profile-card.component';
import { ParticipationTabComponent } from '../profile/components/participation-tab.component';
import { OrganizationTabComponent } from '../profile/components/organization-tab.component';
import { SettingsMenuComponent } from '../profile/components/settings-menu.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private baseUrl = environment.apiUrl;

  readonly user = signal<any>(null);
  readonly eventsParticipating = signal<any[]>([]);
  readonly eventsOrganized = signal<any[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.loading.set(true);

    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed()) // auto cleanup quand le composant est détruit
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.fetchEvents();
        },
        error: (err) => {
          console.error('Erreur profil :', err);
          this.error.set('Erreur lors du chargement du profil.');
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
      error: (err) => {
        console.error('Erreur chargement événements :', err);
        this.error.set('Erreur lors du chargement des événements.');
        this.loading.set(false);
      }
    });
  }

  private getOrganizedEvents() {
    return this.http.get<any[]>(`${this.baseUrl}/event-user/organized`, { withCredentials: true });
  }

  private getParticipatingEvents() {
    return this.http.get<any[]>(`${this.baseUrl}/event-user/participating`, { withCredentials: true });
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Déconnexion', message: 'Voulez-vous vraiment vous déconnecter ?' }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout().subscribe({
          next: () => this.router.navigate(['/login']),
          error: (err) => console.error('Erreur de déconnexion :', err)
        });
      }
    });
  }
}
