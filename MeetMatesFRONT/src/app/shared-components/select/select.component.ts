// Angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

/**
 * Composant de sélection générique basé sur Angular Material.
 *
 * Responsabilités :
 * - encapsuler un `FormControl`
 * - afficher une liste d’options sélectionnables
 * - centraliser la configuration visuelle des champs `select`
 *
 * Utilisé dans les formulaires de création, d’édition
 * et de filtrage de données.
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './select.component.html'
})
export class AppSelectComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() options: { label: string; value: any }[] = [];
  @Input() error = 'Champ requis';
}
