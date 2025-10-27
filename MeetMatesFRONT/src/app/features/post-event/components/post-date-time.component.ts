import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-date-time',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, MatIconModule],
  template: `
  
  <div [formGroup]="form" class="flex flex-col items-center gap-4 w-80">
    <mat-form-field class="w-full">
      <mat-label>Date</mat-label>
      <input matInput [matDatepicker]="picker" formControlName="date">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      @if (form.get('date')?.hasError('required') && (form.get('date')?.touched || form.get('date')?.dirty)) {
      <mat-error>La date est requise.</mat-error>
      }
    </mat-form-field>

    <div class="flex w-full gap-4">
      <mat-form-field class="flex-1">
        <mat-label>Heure de début</mat-label>
        <input matInput type="time" formControlName="startTime" />
        @if (form.get('startTime')?.hasError('required') && (form.get('startTime')?.touched ||
        form.get('startTime')?.dirty)) {
        <mat-error>L’heure de début est requise.</mat-error>
        }
      </mat-form-field>

      <mat-form-field class="flex-1">
        <mat-label>Heure de fin</mat-label>
        <input matInput type="time" formControlName="endTime" />
        @if (form.get('endTime')?.hasError('required') && (form.get('endTime')?.touched || form.get('endTime')?.dirty)) {
        <mat-error>L’heure de fin est requise.</mat-error>
        }
      </mat-form-field>
    </div>

  `
})
export class PostDateTimeComponent {
  @Input() form!: FormGroup;
}
