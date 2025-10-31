import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    RouterModule
  ],
})
export class AppButtonComponent {
  @Input() label!: string;
  @Input() color: 'primary' | 'warn' | 'accent' | 'default' = 'default';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth = false;
  @Input() icon?: string;
  @Input() routerLink?: any[] | string;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
