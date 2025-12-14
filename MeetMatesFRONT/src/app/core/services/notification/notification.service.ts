import { Injectable, inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Service centralisé pour l'affichage des notifications utilisateur.
 *
 * Responsabilités :
 * - Afficher des messages de succès, d’avertissement ou d’erreur
 * - Centraliser la gestion visuelle des feedbacks
 * - Utilise MatSnackBar, notifications d’Angular Material
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  /**
   * Affiche une snackbar personnalisée.
   *
   * @param message Message à afficher
   * @param panelClass Classe CSS appliquée à la snackbar
   * @param duration Durée d’affichage en millisecondes (3 secondes)
   */
  private show(message: string, panelClass: string, duration = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /**
   * Affiche une notification de succès.
   * @param message Contenu du message à afficher
   */
  showSuccess(message: string): void {
   this.show(`✅ ${message}`, 'success-snackbar', 4000);
  }

  /**
   * Affiche une notification d'avertissement.
   * @param message Contenu du message à afficher
   */
  showWarning(message: string): void {
    this.show(`⚠️ ${message}`, 'warning-snackbar', 4000);
  }

  /**
   * Affiche une notification d'erreur.
   * @param message Contenu du message à afficher
   */
  showError(message: string): void {
    this.show(`❌ ${message}`, 'error-snackbar', 4000);
  }
}
