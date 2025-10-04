import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignalsService } from '../../core/services/signals/signals.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { ConfirmDialogComponent } from '../../shared/components-material-angular/Snackbar/confirm-dialog.component'; // ✅ ton dialog réutilisable

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  signals = inject(SignalsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'DECONNEXION',
        message: 'Voulez-vous vous déconnecter ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout().subscribe({
          next: () => {
            console.log('✅ Utilisateur déconnecté');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('❌ Erreur lors de la déconnexion :', err);
          },
        });
      }
    });
  }
}
