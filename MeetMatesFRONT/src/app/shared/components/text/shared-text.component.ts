import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-text',
  standalone: true,
  templateUrl: './shared-text.component.html',
  styleUrls: ['./shared-text.component.scss'],
  imports: [CommonModule],
})
export class SharedTextComponent {
  @Input() size: 'sm'|'base'|'lg'|'xl' = 'base';
  @Input() muted = false;
  @Input() italic = false;

  get sizeClass(): string {
    let classes = `text-${this.size}`;
    if(this.muted) classes += ' muted';
    if(this.italic) classes += ' italic';
    return classes;
  }
}
