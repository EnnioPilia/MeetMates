import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

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

<div [formGroup]="form" class="flex flex-col items-center w-full">
  <div class="w-80">
    <mat-form-field class="w-full" appearance="fill">
      <mat-label>Adresse</mat-label>

      <input
        matInput
        formControlName="addressLabel"
        [matAutocomplete]="auto"
        (input)="onInputChange($event)"
        (keyup)="onInputChange($event)"
      />
      
      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="onOptionSelected($event.option.value)"
      >
        @for (suggestion of suggestions; track suggestion.label) {
          <mat-option [value]="suggestion.label">
            {{ suggestion.label }}
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  </div>
</div>


  `,
})
export class EditEventAddressComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() suggestions: any[] = [];

  @Output() inputChange = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<string>();

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputChange.emit(value);
  }

  onOptionSelected(value: string): void {
    this.form.get('addressLabel')?.setValue(value);
    this.form.get('addressLabel')?.updateValueAndValidity();
    this.optionSelected.emit(value);
  }
}
