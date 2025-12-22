import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-event-date-time',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `

    <div [formGroup]="form" class="flex flex-col items-center gap-4 w-80">

      <mat-form-field class="w-full">
        <mat-label>Date</mat-label>
          <input 
            matInput 
            [matDatepicker]="picker" 
            formControlName="eventDate"
            >
          <mat-datepicker-toggle 
            matSuffix [for]="picker">
          </mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        
        @if (form.get('eventDate')?.hasError('required') 
          && (form.get('eventDate')?.touched || form.get('eventDate')?.dirty)) {
            <mat-error>La date est requise.</mat-error>
        }
      </mat-form-field>

        <div class="flex w-full gap-4">
          <mat-form-field class="flex-1">
            <mat-label>Heure de début</mat-label>
            <input matInput type="time" formControlName="startTime" />
              @if (form.get('startTime')?.hasError('required')) {
                <mat-error>L’heure de début est requise.</mat-error>
              }
          </mat-form-field>

          <mat-form-field class="flex-1">
            <mat-label>Heure de fin</mat-label>
            <input matInput type="time" formControlName="endTime" />
              @if (form.get('endTime')?.hasError('required')) {
                <mat-error>L’heure de fin est requise.</mat-error>
              }
          </mat-form-field>
        </div>
    </div>

  `
})
export class EventDateTimeComponent {
  @Input({ required: true }) form!: FormGroup;
}
