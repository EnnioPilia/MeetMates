import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule,RouterModule],
})
export class AppButtonComponent {
  // --- Inputs ---
  @Input() label!: string;
  @Input() color: 'primary' | 'warn' | 'accent' | 'default' = 'default';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth = false;
  @Input() icon?: string;
  @Input() routerLink?: any[] | string;
  @Input() disabled = false;

  // --- Output ---
  @Output() clicked = new EventEmitter<void>();

  // --- Injection moderne ---
  private location = inject(Location);
  private router = inject(Router);

  // --- Méthodes ---
  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

}
