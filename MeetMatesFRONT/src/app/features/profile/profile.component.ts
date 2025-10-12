import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services/user/user.service';
import { User } from '../../core/models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components-material-angular/snackbar/confirm-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { EventService } from '../../core/services/event/event-service.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private eventService = inject(EventService);
  private baseUrl = environment.apiUrl;

  profileForm: FormGroup;
  user: User | null = null;
  loading = false;
  error: string | null = null;
  selectedIndex = 0;
  eventsParticipating: any[] = [];
  eventsOrganized: any[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient,

  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  get nomControl(): FormControl {
    return this.profileForm.get('nom') as FormControl;
  }

  get prenomControl(): FormControl {
    return this.profileForm.get('prenom') as FormControl;
  }

  get emailControl(): FormControl {
    return this.profileForm.get('email') as FormControl;
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.patchValue({
          nom: data.lastName,
          prenom: data.firstName,
          email: data.email
        });

        this.fetchEvents();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
        console.error('Erreur profil :', err);
      }
    });
  }

  fetchEvents(): void {
    if (!this.user) return;

    this.http.get<any[]>(`${this.baseUrl}/event-user/participating`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log('✅ Participating events:', data);
          this.eventsParticipating = data;

          this.eventsParticipating.forEach((eventUser, index) => {
            this.http.get(`${this.baseUrl}/event/${eventUser.eventId}`, { withCredentials: true })
              .subscribe({
                next: (fullEvent) => {
                  this.eventsParticipating[index] = {
                    ...eventUser,
                    ...fullEvent
                  };
                },
                error: (err) => console.error('Erreur chargement détails événement:', err)
              });
          });
        },
        error: (err) => console.error('Erreur chargement événements participant :', err)
      });

    this.http.get<any[]>(`${this.baseUrl}/event-user/organized`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log('✅ Organized events:', data);
          this.eventsOrganized = data;

          this.eventsOrganized.forEach((eventUser, index) => {
            this.http.get(`${this.baseUrl}/event/${eventUser.eventId}`, { withCredentials: true })
              .subscribe({
                next: (fullEvent) => {
                  this.eventsOrganized[index] = {
                    ...eventUser,
                    ...fullEvent
                  };
                },
                error: (err) => console.error('Erreur chargement détails événement organisé:', err)
              });
          });
        },
        error: (err) => console.error('Erreur chargement événements organisés :', err)
      });
  }

  onTabChange(event: any): void {
    this.selectedIndex = event.index;
  }

  onFocusChange(event: any): void {
    this.selectedIndex = event.index;
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'DECONNEXION', message: 'Voulez-vous vous déconnecter ?' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.authService.logout().subscribe({
          next: () => this.router.navigate(['/login']),
          error: (err) => console.error(err)
        });
      }
    });
  }

  getStatusLabel(status: string): string {
    return this.eventService.getStatusLabel(status);
  }

  getParticipationLabel(status: string | null | undefined): string {
    return this.eventService.getParticipationLabel(status);
  }
}
