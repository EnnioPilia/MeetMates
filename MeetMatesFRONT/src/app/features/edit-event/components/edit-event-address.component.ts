import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { AddressSuggestion } from '../../../core/services/address/address.service'; //

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
  
  @Input() suggestions: AddressSuggestion[] = [];
  @Output() inputChange = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<AddressSuggestion>();

  onInputChange(event: Event) {
    this.inputChange.emit(
      (event.target as HTMLInputElement).value
    );
  }

  onOptionSelected(suggestion: AddressSuggestion) {
    this.optionSelected.emit(suggestion);
  }

  displayLabel = (value: AddressSuggestion | string) =>
    typeof value === 'string' ? value : value?.label ?? '';
}
