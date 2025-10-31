import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-event-date-time',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
  
    <div [formGroup]="form" class="flex flex-col items-center w-full">
      <mat-form-field class="w-80" appearance="fill">
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="eventDate" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <div class="flex w-80 gap-4">
        <mat-form-field class="flex-1" appearance="fill">
          <mat-label>Heure de début</mat-label>
          <input matInput type="time" formControlName="startTime" />
        </mat-form-field>

        <mat-form-field class="flex-1" appearance="fill">
          <mat-label>Heure de fin</mat-label>
          <input matInput type="time" formControlName="endTime" />
        </mat-form-field>
      </div>
    </div>
  `,
})
export class EditEventDateTimeComponent {
  @Input({ required: true }) form!: FormGroup;
}
