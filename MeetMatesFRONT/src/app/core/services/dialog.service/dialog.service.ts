import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';
import { CguDialogComponent } from '../../../shared-components/cgu-dialog/cgu-dialog.component';

/**
 * Service centralisé pour la gestion des boîtes de dialogue.
 *
 * Responsabilités :
 * - Ouvrir un popup de confirmation réutilisable
 * - Utilise MatDialog le système de boîtes de dialogue d’Angular Material
 * - Ouvrir les CGU
 * - Ouvrir les Mentions légales
 */
@Injectable({ providedIn: 'root' })
export class DialogService {

  private dialog = inject(MatDialog);

  /**
   * Ouvre une boîte de dialogue de confirmation réutilisable.
   * @param title Titre affiché dans la popup
   * @param message Message affiché dans la popup
   * @returns Observable émettant `true` si l’utilisateur confirme, sinon `false`
   */
  confirm(title: string, message: string): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: { title, message }
    }).afterClosed();
  }

  /** Ouvre les Conditions Générales d’Utilisation. */
  openCgu() {
    this.dialog.open(CguDialogComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: 'cgu' }
    });
  }

  /** Ouvre les mentions légales. */
  openMentions() {
    this.dialog.open(CguDialogComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: 'mentions' }
    });
  }
}
