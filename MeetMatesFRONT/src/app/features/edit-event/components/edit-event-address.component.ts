// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';

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
 * Les suggestions d’adresses sont fournies par le composant parent.
 *
 * Ce composant :
 * - affiche l’adresse courante de l’événement
 * - propose une autocomplétion basée sur des suggestions
 * - relaie les interactions utilisateur vers le parent
 *
 * Il ne modifie pas directement le `FormGroup`.
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
          [value]="displayValue"
          [matAutocomplete]="auto"
          autocomplete="off"
          (input)="onInputChange($event)"
        />

        <mat-autocomplete
          #auto="matAutocomplete"
          (optionSelected)="onOptionSelected($event.option.value)">
          @for (suggestion of suggestions; track suggestion.label) {
            <mat-option [value]="suggestion">
              {{ suggestion.street }}, {{ suggestion.postalCode }} {{ suggestion.city }}
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
})
export class EditEventAddressComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) suggestions: AddressSuggestion[] = [];

  /** Émis à chaque modification du champ d’adresse. */
  @Output() inputChange = new EventEmitter<string>();

  /** Émis lorsqu’une suggestion est sélectionnée par l’utilisateur. */
  @Output() optionSelected = new EventEmitter<AddressSuggestion>();

  /** Accès au groupe `address` du formulaire parent. */
  get addressForm(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  /** Valeur affichée dans le champ d’adresse (combine rue, code postal et ville). */
  get displayValue(): string {
    const a = this.addressForm.value;
    return a.street
      ? `${a.street}, ${a.postalCode} ${a.city}`
      : '';
  }

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
   * @param address Adresse sélectionnée
   */
  onOptionSelected(address: AddressSuggestion) {
    this.optionSelected.emit(address);
  }

}