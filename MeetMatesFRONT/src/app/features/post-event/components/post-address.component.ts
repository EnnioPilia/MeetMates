import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

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
          (input)="onInputChange($event)"
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
  @Input() suggestions: any[] = [];
  @Output() inputChange = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<string>();

  get control(): FormControl {
    return this.form.get(this.controlName) as FormControl;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputChange.emit(value);
  }

  onOptionSelected(value: string): void {
    this.optionSelected.emit(value);
  }
}
