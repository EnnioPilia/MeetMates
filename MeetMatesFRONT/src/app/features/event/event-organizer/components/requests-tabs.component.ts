import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-participants-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, MatButtonModule],
  templateUrl: './requests-tabs.component.html',
})
export class RequestsTabsComponent {
  @Input() acceptedParticipants: { id: string; firstName: string; lastName: string }[] = [];
  @Input() pendingParticipants: { id: string; firstName: string; lastName: string }[] = [];
  @Input() organizerName = '';

  @Output() accept = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  onAccept(id: string) {
    this.accept.emit(id);
  }

  onReject(id: string) {
    this.reject.emit(id);
  }
  onRemove(id: string) {
    this.remove.emit(id);
  }
}
