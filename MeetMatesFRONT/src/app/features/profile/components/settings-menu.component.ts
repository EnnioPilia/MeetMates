// Angular
import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Sous-composant responsable de l’affichage
 * du menu de paramètres du profil utilisateur.
 *
 * Responsabilités :
 * - exposer des événements d’intention :
 *   - édition du profil
 *   - affichage des mentions légales
 *   - affichage des CGU
 *   - déconnexion
 *   - suppression du compte
 */
@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports:
    [CommonModule,
      MatMenuModule,
      MatButtonModule,
      MatIconModule,
      RouterModule
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  
    <div class="absolute top-15 right-5 z-50">

      <button mat-icon-button [matMenuTriggerFor]="settingsMenu">
        <mat-icon>settings</mat-icon>
      </button>

      <mat-menu #settingsMenu="matMenu">
        <button mat-menu-item (click)="editProfile.emit()">
          <span>Modifier le profil</span><mat-icon>edit</mat-icon>
        </button>

        <button mat-menu-item (click)="showMentions.emit()">
          <span>Mentions légales</span><mat-icon>gavel</mat-icon>
        </button>
        
        <button mat-menu-item (click)="showCgu.emit()">
          <span>Conditions d’utilisation</span><mat-icon>description</mat-icon>
        </button>

        <button mat-menu-item (click)="logout.emit()">
          <span>Déconnexion</span><mat-icon>logout</mat-icon>
        </button>

        <button mat-menu-item (click)="deleteAccount.emit()">
          <span>Supprimer le compte</span><mat-icon>delete_forever</mat-icon>
        </button>
      </mat-menu>

    </div>
  `,
})
export class SettingsMenuComponent {
  @Output() editProfile = new EventEmitter<void>();
  @Output() showMentions = new EventEmitter<void>();
  @Output() showCgu = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() deleteAccount = new EventEmitter<void>();
}
