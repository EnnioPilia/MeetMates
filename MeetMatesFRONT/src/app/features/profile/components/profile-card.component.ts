// Angular
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Core (models)
import { User } from '../../../core/models/user.model';

/**
 * Sous-composant de présentation chargé
 * de l’affichage des informations utilisateur.
 *
 * Responsabilités :
 * - afficher la photo de profil
 * - afficher le nom, prénom et email
 */
@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="flex flex-col items-center gap-3 w-full mt-8 text-center relative">
      <img 
        [src]="user?.profilePictureUrl || 'assets/images/default-avatar.png'"
        alt="photo"
        class="w-32 h-32 rounded-full object-cover border-2 border-black"
      />
      <p>{{ user?.lastName }} {{ user?.firstName }}</p>
      <p>{{ user?.email }}</p>
    </div>
  `,
})
export class ProfileCardComponent {
  @Input() user: User | null = null;
}
