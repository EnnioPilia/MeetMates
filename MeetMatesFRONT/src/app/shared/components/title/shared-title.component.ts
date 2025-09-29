import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-title',
  standalone: true,
  templateUrl: './shared-title.component.html',
  styleUrls: ['./shared-title.component.scss'],
  imports: [CommonModule],
})
export class SharedTitleComponent {
  @Input() level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
}
