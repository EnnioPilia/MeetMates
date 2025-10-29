import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppButtonComponent } from '../../../../shared-components/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared-components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-organizer-actions',
  standalone: true,
  imports: [CommonModule, AppButtonComponent],
  template: `

    <app-button
      label="SUPPRIMER L'ACTIVITÉ"
      class="w-full primary-button-cancel"
      (clicked)="confirmDeleteEvent()">
    </app-button>

  `,
})
export class EventOrganizerActionsComponent {
  @Input() eventId!: string;
  @Output() delete = new EventEmitter<string>();
  private dialog = inject(MatDialog);

  confirmDeleteEvent(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l’activité',
        message: 'Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.delete.emit(this.eventId);
      }
    });
  }
}
