// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

// Core (services)
import { AddressSuggestion } from '../../../core/services/address/address.service';

/**
 * Sous-composant de formulaire dédié à la saisie et à la sélection
 * de l’adresse de l’événement.
 *
 * Les suggestions d’adresses sont fournies par le parent.
 *
 * Ce composant :
 * - ne modifie pas directement le `FormGroup`
 * - se limite à la présentation et au relais des interactions utilisateur
 */
@Component({
  selector: 'app-edit-event-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  template: `
  
    <div class="w-80">
      <mat-form-field class="w-full">
        <mat-label>Adresse</mat-label>

        <input
          matInput
          [matAutocomplete]="auto"
          (input)="onInputChange($event)" />

        <mat-autocomplete
          #auto="matAutocomplete"
          [displayWith]="displayLabel"
          (optionSelected)="onOptionSelected($event.option.value)">
          @for (suggestion of suggestions; track suggestion.label) {
            <mat-option [value]="suggestion">
              {{ suggestion.label }}
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
})
export class EditEventAddressComponent {
  
  @Input({ required: true }) suggestions: AddressSuggestion[] = [];

  /** Émis à chaque modification du champ d’adresse. */
  @Output() inputChange = new EventEmitter<string>();

  /** Émis lorsqu’une suggestion est sélectionnée par l’utilisateur. */
  @Output() optionSelected = new EventEmitter<AddressSuggestion>();

  /**
   * Relaye la saisie utilisateur vers le composant parent.
   * 
   * @param event Événement DOM de saisie
   */
  onInputChange(event: Event) {
    this.inputChange.emit(
      (event.target as HTMLInputElement).value
    );
  }

  /**
    * Relaye la sélection d’une suggestion d’adresse.
    *
    * @param suggestion Suggestion sélectionnée
    */
  onOptionSelected(suggestion: AddressSuggestion) {
    this.optionSelected.emit(suggestion);
  }

  /**
   * Fonction d’affichage utilisée par `mat-autocomplete`.
   * Permet de présenter un libellé lisible pour une suggestion.
   */
  displayLabel = (value: AddressSuggestion | string) =>
    typeof value === 'string' ? value : value?.label ?? '';
}
