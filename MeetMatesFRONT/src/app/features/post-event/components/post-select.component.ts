// Angular
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

// Angular Material
import { MatSelectModule } from '@angular/material/select';

// Core (models)
import { Activity } from '../../../core/models/activity.model';

/**
 * Sous-composant de formulaire dédié à la sélection
 * de l’activité associée à l’événement.
 *
 * Responsabilités :
 * - afficher la liste des activités disponibles
 * - permettre la sélection d’une activité
 * - afficher les erreurs de validation
 */
@Component({
  selector: 'app-post-select',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatSelectModule
  ],
  template: `
  
    <div [formGroup]="form" class="flex flex-col items-center gap-4 w-80">
      <mat-form-field class="w-full">
        <mat-label>Activité</mat-label>
        <mat-select formControlName="activityId">
          @for (act of activities; track act.id) {
            <mat-option [value]="act.id">
              {{ act.name }}
            </mat-option>
          }
        </mat-select>

        @if (form.get('activityId')?.hasError('required') && (form.get('activityId')?.touched || form.get('activityId')?.dirty)) {
          <mat-error>Veuillez sélectionner une activité.</mat-error>
        }
      </mat-form-field>
    </div>
  `
})
export class PostSelectComponent {
  @Input() form!: FormGroup;
  @Input() activities: Activity[] = [];  
}
