// Angular
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Core (services)
import { AddressSuggestion } from '../../../core/services/address/address.service';

/**
 * Sous-composant de présentation dédié à la saisie
 * et à l’autocomplétion de l’adresse d’un événement.
 *
 * Responsabilités :
 * - gérer la saisie textuelle de l’adresse
 * - déclencher la recherche d’adresses à partir de l’input utilisateur
 * - afficher les suggestions d’adresses
 * - synchroniser l’adresse sélectionnée avec le FormGroup parent
 */

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
        [formControl]="addressLabelControl"
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
          @if (addressLabelControl.hasError('required') && addressLabelControl.touched) {
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

  /** Contrôle interne utilisé pour l’input d’adresse */
  addressInput = new FormControl('');

  /**
   * FormGroup imbriqué contenant les champs
   * structurels de l’adresse (street, city, postalCode).
   */
  get addressGroup(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  /** Valeur formatée de l’adresse à afficher dans le champ texte */
  get displayValue(): string {
    const a = this.addressGroup.value;
    return a?.street
      ? `${a.street}, ${a.postalCode} ${a.city}`
      : '';
  }

  /** Contrôle associé au champ texte affiché (mat-error) . */
  get addressLabelControl(): FormControl {
    return this.form.get('addressLabel') as FormControl;
  }

  /** Initialise le champ d’affichage si une adresse est déjà présente (mode édition). */
  ngOnInit() {
    const a = this.addressGroup?.value;
    if (a?.street) {
      this.addressInput.setValue(
        `${a.street}, ${a.postalCode} ${a.city}`,
        { emitEvent: false }
      );
    }
  }

  /**
   * Déclenché lors de la saisie utilisateur.
   * Émet une recherche d’adresse si la longueur minimale est atteinte.
   */
  onInput() {
    const value = this.addressLabelControl.value ?? '';
    if (value.length < 3) {
      return;
    }

    this.addressGroup.reset();
    this.addressLabelControl.setErrors({ required: true });
    this.inputChange.emit(value);
  }

  /** Applique l’adresse sélectionnée depuis l’autocomplétion et synchronise le FormGroup parent. */
  onSelect(address: AddressSuggestion) {
    this.addressGroup.patchValue({
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
    });

    this.addressLabelControl.setValue(this.displayValue, { emitEvent: false });
    this.addressLabelControl.setErrors(null);
    this.addressLabelControl.markAsTouched();
    this.optionSelected.emit(address);
  }
}
