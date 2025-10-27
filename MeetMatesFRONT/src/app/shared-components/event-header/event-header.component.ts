import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-header',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule
  ],
  templateUrl: './event-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventHeaderComponent {
  @Input() title = '';
  @Input() description = '';
  @Output() cancel = new EventEmitter<void>();
}
