import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Core
import { AddressSuggestion } from '../../../core/services/address/address.service';

@Component({
  selector: 'app-event-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  template: `

    <div [formGroup]="addressGroup" class="w-80">

      <mat-form-field class="w-full">
        <mat-label>Adresse</mat-label>

        <input
          matInput
          [formControl]="addressInput"
          [matAutocomplete]="auto"
          (input)="onInput()" />

        <mat-autocomplete
          #auto="matAutocomplete"
          (optionSelected)="onSelect($event.option.value)">

          @for (s of suggestions; track s.label) {
            <mat-option [value]="s">
              {{ s.street }}, {{ s.postalCode }} {{ s.city }}
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
export class EventAddressComponent implements OnInit {

  @Input({ required: true }) form!: FormGroup;
  @Input() suggestions: AddressSuggestion[] = [];

  @Output() inputChange = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<AddressSuggestion>();

  addressInput = new FormControl('');

  get addressGroup(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  get displayValue(): string {
    const a = this.addressGroup.value;
    return a?.street
      ? `${a.street}, ${a.postalCode} ${a.city}`
      : '';
  }

  ngOnInit() {
    const a = this.addressGroup?.value;
    if (a?.street) {
      this.addressInput.setValue(
        `${a.street}, ${a.postalCode} ${a.city}`,
        { emitEvent: false }
      );
    }
  }

  onInput() {
    const value = this.addressInput.value ?? '';
    if (value.length < 3) return;
    this.inputChange.emit(value);
  }


  onSelect(address: AddressSuggestion) {
    this.addressGroup.patchValue({
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
    });

    this.addressInput.setValue(this.displayValue, { emitEvent: false });
    this.optionSelected.emit(address);
  }
}
