import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/users/user.service';
import { Users } from '../../core/models/users.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormControl  } from '@angular/forms';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../shared/components/shared-button/shared-button.component';
import { SharedTitleComponent } from '../../shared/components/shared-title/shared-title.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedInputComponent, SharedButtonComponent,SharedTitleComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  user: Users | null = null;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(0)]],
    });
  }

  // Les getters pour éviter l'erreur de null
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

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.profileForm.patchValue({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          age: data.age,
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
        console.error('Erreur dans subscribe:', err);
      }
    });
  }
  
}