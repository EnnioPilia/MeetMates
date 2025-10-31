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







<!-- flex fait buger le style du boutton -->
<div class="flex flex-col items-center mb-5 gap-3"> 
<app-button
  label="MODIFIER"
  class="w-full primary-button"
  [routerLink]="['/edit-event', eventId]">
</app-button>
    <app-button
      label="SUPPRIMER"
      class="w-full primary-button"
      (clicked)="confirmDeleteEvent()">
    </app-button>

</div>
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
