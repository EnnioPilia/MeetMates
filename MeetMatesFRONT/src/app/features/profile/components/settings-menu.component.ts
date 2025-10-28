import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CguDialogComponent } from '../../../shared-components/cgu-dialog/cgu-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../../core/services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
        <button mat-menu-item [routerLink]="['/edit-profile']">
          <mat-icon>edit</mat-icon>
          <span>Modifier le profil</span>
        </button>

        <button mat-menu-item (click)="openMentionsDialog()">
          <mat-icon>gavel</mat-icon>
          <span>Mentions légales</span>
        </button>
        
        <button mat-menu-item (click)="openCguDialog()">
          <mat-icon>description</mat-icon>
          <span>Conditions d’utilisation</span>
        </button>

        <button mat-menu-item (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Déconnexion</span>
        </button>

        <button mat-menu-item (click)="onDeleteAccount()">
          <mat-icon>delete_forever</mat-icon>
          <span>Supprimer le compte</span>
        </button>

      </mat-menu>
    </div>
  `,
})
export class SettingsMenuComponent {
  @Output() logout = new EventEmitter<void>();
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);

  openCguDialog() {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false });
  }

  openMentionsDialog(): void {
    this.dialog.open(CguDialogComponent, { width: '600px', autoFocus: false, data: { type: 'mentions' } });
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Déconnexion',
        message: 'Voulez-vous vraiment vous déconnecter de votre compte ?'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Erreur lors de la déconnexion :', err);
          },
        });
      }
    });
  }

  onDeleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression du compte',
        message: 'Voulez-vous vraiment supprimer définitivement votre compte ? Cette action est irréversible.'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteMyAccount().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Erreur suppression compte :', err);
          },
        });
      }
    });
  }
}
