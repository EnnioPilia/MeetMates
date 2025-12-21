// Angular
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

/**
 * Boîte de dialogue générique de confirmation.
 *
 * Permet de demander une validation utilisateur
 * avant l’exécution d’une action critique.
 *
 * Retourne un booléen indiquant la décision utilisateur.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatDialogModule
  ],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  public data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }
}
