import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

// Angular Material
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

// Shared constants
import { AppSelectComponent } from '../../../shared-components/select/select.component';
import { MATERIAL_OPTIONS, LEVEL_OPTIONS} from '../../../shared-components/constants/event-option';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    AppSelectComponent
  ],
  template: `
  
    <div [formGroup]="form" class="flex flex-col w-80 gap-4">

      <app-select
        label="Niveau"
        [control]="levelControl"
        [options]="levelOptions"
        error="Niveau requis">
      </app-select>

      <div>
        <label class="block mb-2">Matériel :</label>
        <mat-radio-group
          formControlName="material"
          class="flex flex-col gap-1">
            @for (option of materialOptions; track option.value) {
              <mat-radio-button [value]="option.value">
                {{ option.label }}
              </mat-radio-button>
            }
        </mat-radio-group>
          @if (
            form.get('material')?.hasError('required') &&
            (form.get('material')?.touched || form.get('material')?.dirty)) {
              <mat-error>Veuillez choisir une option de matériel.</mat-error>
          }
      </div>
    </div>
  `
})
export class EventDetailsComponent {

  @Input({ required: true }) form!: FormGroup;

  materialOptions = MATERIAL_OPTIONS;
  levelOptions = LEVEL_OPTIONS;

  get levelControl(): FormControl {
    return this.form.get('level') as FormControl;
  }
}
