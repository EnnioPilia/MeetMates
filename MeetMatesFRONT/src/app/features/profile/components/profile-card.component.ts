import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  
    <mat-card class="flex flex-col items-center gap-2 w-full mt-8 text-center">
      <img [src]="'assets/default-avatar.png'" alt="Photo de profil" class="w-32 h-32 rounded-full object-cover border-2 border-black" />
      <p>{{ user.lastName }} {{ user.firstName }}</p>
      <p>{{ user.email }}</p>
    </mat-card>
    
  `,
})
export class ProfileCardComponent {
  @Input({ required: true }) user!: User;
}
