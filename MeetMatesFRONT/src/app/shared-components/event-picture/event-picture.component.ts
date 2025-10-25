import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-event-picture',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './event-picture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventPictureComponent {
  @Input() imageUrl: string | null = null;
  @Input() title = '';
  @Input() width = 280;
  @Input() height = 130;
}
