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
          <span>Modifier le profil</span><mat-icon>edit</mat-icon>
        </button>

        <button mat-menu-item (click)="openMentionsDialog()">
          <span>Mentions légales</span><mat-icon>gavel</mat-icon>
        </button>
        
        <button mat-menu-item (click)="openCguDialog()">
          <span>Conditions d’utilisation</span><mat-icon>description</mat-icon>
        </button>

        <button mat-menu-item (click)="onLogout()">
          <span>Déconnexion</span><mat-icon>logout</mat-icon>
        </button>

        <button mat-menu-item (click)="onDeleteAccount()">
          <span>Supprimer le compte</span><mat-icon>delete_forever</mat-icon>
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
