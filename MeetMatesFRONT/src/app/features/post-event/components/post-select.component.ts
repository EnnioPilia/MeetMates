import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-post-select',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatSelectModule
  ],
  template: `
  
    <div [formGroup]="form" class="w-80">
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
  @Input() activities: any[] = [];
}
