import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
          <mat-option *ngFor="let act of activities" [value]="act.id">
            {{ act.name }}
          </mat-option>
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
  @Input() activities: any[] = [];
}
