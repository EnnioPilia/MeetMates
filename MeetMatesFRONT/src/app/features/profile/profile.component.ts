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
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  user: User | null = null;
  loading = false;
  error: string | null = null;

  selectedIndex = 0;
  eventsParticipating: any[] = [];
  eventsOrganized: any[] = [];

  private baseUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient,

  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(0)]],
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

  get ageControl(): FormControl {
    return this.profileForm.get('age') as FormControl;
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
          email: data.email,
          age: data.age,
        });

        // Charger les événements après récupération du user
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

    // Événements auxquels il participe
    this.http.get<any[]>(`${this.baseUrl}/event-user/participating`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log('✅ Participating events:', data);
          this.eventsParticipating = data;
        },
        error: (err) => console.error('Erreur chargement événements participant :', err)
      });

    // Événements organisés
    this.http.get<any[]>(`${this.baseUrl}/event-user/organized`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log('✅ Organized events:', data);
          this.eventsOrganized = data;
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

}
