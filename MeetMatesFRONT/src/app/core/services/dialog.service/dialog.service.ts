import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared-components/confirm-dialog/confirm-dialog.component';
import { CguDialogComponent } from '../../../shared-components/cgu-dialog/cgu-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialog = inject(MatDialog);

   // * Ouvre une boîte de confirmation réutilisable
  confirm(title: string, message: string): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: { title, message }
    }).afterClosed();
  }

  // * Ouvre les CGU
  openCgu() {
    this.dialog.open(CguDialogComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: 'cgu' }
    });
  }

  // * Ouvre les mentions légales
  openMentions() {
    this.dialog.open(CguDialogComponent, {
      width: '600px',
      autoFocus: false,
      data: { type: 'mentions' }
    });
  }
}
