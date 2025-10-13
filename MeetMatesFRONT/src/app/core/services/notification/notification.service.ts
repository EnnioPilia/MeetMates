import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private show(message: string, panelClass: string, duration = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showSuccess(message: string): void {
    this.show(message, 'success-snackbar', 3000);
  }

  showWarning(message: string): void {
    this.show(message, 'warning-snackbar', 3500);
  }

  showError(message: string = 'Une erreur est survenue'): void {
    this.show(message, 'error-snackbar', 4000);
  }
}
