// Angular
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

// Angular Material
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Core (models)
import { Activity } from '../../../core/models/activity.model';

/**
 * Sous-composant de formulaire dédié à la sélection de l’activité
 * et au nombre maximal de participants.
 *
 * Le `FormGroup` est fourni par le parent et doit contenir
 * les contrôles suivants :
 * - `activityId`
 * - `maxParticipants`
 *
 * Ce composant est purement déclaratif et ne crée
 * aucun contrôle de formulaire.
 */
@Component({ 
  selector: 'app-edit-event-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `

    <div [formGroup]="form" class="flex flex-col items-center w-full">
      <mat-form-field class="w-full">
        <mat-label>Activité</mat-label>
        <mat-select formControlName="activityId">
          @for (act of activities; track act.id) {
            <mat-option [value]="act.id">
              {{ act.name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field class="w-80">
        <mat-label>Nombre de participants</mat-label>
        <input matInput type="number" formControlName="maxParticipants" min="1" />
      </mat-form-field>
    </div>
  `
})
export class EditEventActivityComponent {
  
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) activities: Activity[] = [];
}
