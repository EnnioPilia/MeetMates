// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

/**
 * Carte cliquable avec icône et titre.
 *
 * Responsabilités :
 * - afficher une icône illustrative et un libellé
 * - gérer différentes tailles prédéfinies
 * - émettre un événement lors du clic utilisateur
 */
@Component({
  selector: 'app-icon-card',
  standalone: true,
  imports: [
    MatCardModule, 
    NgClass
  ],
  templateUrl: './icon-card.component.html'
})
export class IconCardComponent {
  @Input() title!: string;
  @Input() iconPath!: string; 
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }

  get cardSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'w-32 h-32';
      case 'lg':
        return 'w-40 h-40';
      default:
        return 'w-40 h-40';
    }
  }
}
