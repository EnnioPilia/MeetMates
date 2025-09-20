import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  imports: [CommonModule],
})
export class AlertComponent {
  @Input() message!: string;
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
}
