import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-edit-event-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    AppInputComponent
  ],
  template: `

    <div [formGroup]="form" class="flex flex-col items-center w-full">
      <div class="w-80 flex flex-col items-start">
        <mat-label>Statut :</mat-label>
        <mat-button-toggle-group formControlName="status">
          @for (option of statusOptions; track option.value) {
            <mat-button-toggle [value]="option.value">
              {{ option.label }}
            </mat-button-toggle>
          }
        </mat-button-toggle-group>
      </div>

        <app-input 
          label="Titre" 
          [control]="form.get('title')!" 
          type="text"
          [maxLength]="20">
        </app-input>

      <mat-form-field appearance="fill" class="w-80">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="4"></textarea>
      </mat-form-field>
    </div>
  `
})
export class EditEventInfoComponent {
  @Input() form!: FormGroup;
  
  statusOptions = [
    { value: 'OPEN', label: 'Ouvert' },
    { value: 'FULL', label: 'Complet' },
    { value: 'CANCELLED', label: 'Annulé' },
    { value: 'FINISHED', label: 'Terminé' },
  ];
}
