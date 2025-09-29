import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-button.component.html',
  styleUrls: ['./shared-button.component.scss']
})
export class SharedButtonComponent {
  /** Texte affiché sur le bouton */
  @Input() label: string = 'Envoyer';

  /** Type HTML standard : "button" ou "submit" */
  @Input() htmlType: 'button' | 'submit' = 'button';

  /** Variante visuelle : primary / secondary */ 
  @Input() variant: 'primary' | 'secondary' = 'primary'; // <---- ajout du tertiary

  /** États */
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() invalid: boolean = false;

  /** Événement click émis par le bouton */
  @Output() onClick = new EventEmitter<Event>();

  handleClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
 }
