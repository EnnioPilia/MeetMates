// Angular
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

// Core (services)
import { AddressSuggestion } from '../../../core/services/address/address.service';

/**
 * Sous-composant de formulaire dédié à la saisie
 * et à la sélection d’une adresse.
 *
 * Responsabilités :
 * - afficher un champ de saisie avec autocomplétion
 * - afficher les suggestions d’adresses fournies par le parent
 * - émettre les intentions utilisateur :
 *   - saisie de texte (recherche)
 *   - sélection d’une adresse
 */
@Component({
  selector: 'app-post-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  template: `
  
    <div [formGroup]="form" class="w-80">
      <mat-form-field class="w-full">
        <mat-label>Adresse</mat-label>
        
        <input
          matInput
          [formControl]="control"
          [matAutocomplete]="auto"
          (input)="onInputChange($event)"/>

        <mat-autocomplete
          #auto="matAutocomplete"
          [displayWith]="displayAddress"
          (optionSelected)="onOptionSelected($event.option.value)"
        >
          @for (suggestion of suggestions; track suggestion.label) {
            <mat-option [value]="suggestion">
              {{ suggestion.label }}
            </mat-option>
          }
        </mat-autocomplete>

        @if (form.get('adresse')?.hasError('required') && (form.get('adresse')?.touched || form.get('adresse')?.dirty)) {
          <mat-error>L’adresse est requise.</mat-error>
        }
      </mat-form-field>
    </div>

  `
})
export class PostAddressComponent {
  
  @Input() form!: FormGroup;
  @Input() controlName = 'adresse';
  @Input() suggestions: AddressSuggestion[] = [];
  @Output() inputChange = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<{
    street: string;
    city: string;
    postalCode: string;
  }>();

  get control(): FormControl {
    return this.form.get(this.controlName) as FormControl;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputChange.emit(value);
  }

  onOptionSelected(suggestion: AddressSuggestion): void {
    this.optionSelected.emit({
      street: suggestion.street,
      city: suggestion.city,
      postalCode: suggestion.postalCode
    });
  }

  displayAddress = (address: any): string => {
    return address?.label ?? '';
  };
}
