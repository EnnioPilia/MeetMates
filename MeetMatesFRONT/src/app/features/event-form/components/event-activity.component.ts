import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

// Core
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-event-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  template: `
    <div [formGroup]="form" class="flex flex-col items-center w-80 gap-4">

      <mat-form-field class="w-full">
        <mat-label>Activité</mat-label>
        <mat-select formControlName="activityId">
          @for (activity of activities; track activity.id) {
            <mat-option [value]="activity.id">
              {{ activity.name }}
            </mat-option>
          }
        </mat-select>

        @if (form.get('activityId')?.invalid && form.get('activityId')?.touched) {
          <mat-error>Activité requise</mat-error>
        }
      </mat-form-field>

      <mat-form-field class="w-full">
        <mat-label>Nombre de participants</mat-label>
        
        <input
          matInput
          type="number"
          min="2"
          formControlName="maxParticipants" />

        @if (form.get('maxParticipants')?.invalid && form.get('maxParticipants')?.touched) {
          <mat-error>Minimum 2 participants</mat-error>
        }
      </mat-form-field>

    </div>
  `
})
export class EventActivityComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() activities: Activity[] = [];
  
}
