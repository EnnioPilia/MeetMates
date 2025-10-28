import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CguDialogComponent } from '../../../shared-components/cgu-dialog/cgu-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

       <button mat-menu-item (click)="openMentionsDialog()">
          <mat-icon>gavel</mat-icon>
          <span>Mentions légales</span>
        </button>


        <button mat-menu-item (click)="openCguDialog()">
          <mat-icon>logout</mat-icon>
          <span>Déconnexion</span>
        </button>
      </mat-menu>
    </div>
  `,
})
export class SettingsMenuComponent {
  @Output() logout = new EventEmitter<void>();
  private dialog = inject(MatDialog);

  openCguDialog() {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false });
  }
  
  openMentionsDialog(): void {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false, data: { type: 'mentions' } });
  }
}
