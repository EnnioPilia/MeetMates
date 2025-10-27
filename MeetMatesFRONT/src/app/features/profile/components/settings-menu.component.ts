import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [
    CommonModule, 
    MatMenuModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  
    <div class="absolute top-15 right-5 z-50 ">
      <button mat-icon-button [matMenuTriggerFor]="settingsMenu" aria-label="Ouvrir le menu paramètres">
        <mat-icon>settings</mat-icon>
      </button>

      <mat-menu #settingsMenu="matMenu" xPosition="before" yPosition="below" class="menu-profile">
        <button mat-menu-item [routerLink]="['/profil']">
          <mat-icon>edit</mat-icon>
          <span>Modifier le profil</span>
        </button>

        <button mat-menu-item routerLink="/mentions-legales">
          <mat-icon>gavel</mat-icon>
          <span>Mentions légales</span>
        </button>

        <button mat-menu-item (click)="logout.emit()">
          <mat-icon>logout</mat-icon>
          <span>Déconnexion</span>
        </button>
      </mat-menu>
    </div>
  `,
})
export class SettingsMenuComponent {
  @Output() logout = new EventEmitter<void>();
}
