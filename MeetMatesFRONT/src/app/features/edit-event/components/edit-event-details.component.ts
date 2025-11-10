import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MATERIAL_OPTIONS, LEVEL_OPTIONS } from '../../../shared-components/constants/event-option';

@Component({
  selector: 'app-edit-event-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule
  ],
  template: `

    <div [formGroup]="form">
      <mat-form-field class="w-80">
        <mat-label>Niveau</mat-label>
          <mat-select formControlName="level">
            @for (option of levelOptions; track option.value) {
              <mat-option [value]="option.value">
                {{ option.label }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

      <div>
        <mat-label>Matériel :</mat-label>
          <mat-radio-group formControlName="material" class="flex flex-col">
            @for (option of materialOptions; track option.value) {
              <mat-radio-button [value]="option.value">
                {{ option.label }}
              </mat-radio-button>
            }
          </mat-radio-group>
      </div>
    </div>
  `
})
export class EditEventDetailsComponent {
  @Input({ required: true }) form!: FormGroup;

  materialOptions = MATERIAL_OPTIONS;
  levelOptions = LEVEL_OPTIONS;
}
