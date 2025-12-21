// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Composant bouton réutilisable.
 *
 * Fournit une abstraction commune autour des boutons de l’application :
 * - gestion des styles
 * - icône optionnelle
 * - navigation via `routerLink`
 * - émission d’un événement d’intention au clic
 */
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
  @Input() routerLink?: string | (string | number)[];
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
