import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Shared
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-event-info',
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

      @if (showStatus) {
        <mat-button-toggle-group formControlName="status">
          <mat-button-toggle value="OPEN">Ouvert</mat-button-toggle>
          <mat-button-toggle value="FULL">Complet</mat-button-toggle>
          <mat-button-toggle value="CANCELLED">Annulé</mat-button-toggle>
          <mat-button-toggle value="FINISHED">Terminé</mat-button-toggle>
        </mat-button-toggle-group>
      }

      <app-input
        label="Titre"
        [control]="form.get('title')!"
        type="text">
      </app-input>

      <mat-form-field class="w-80">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
           @if (form.get('description')?.hasError('required') && 
           (form.get('description')?.touched || form.get('description')?.dirty)) {
          <mat-error>Description est requise.</mat-error>
        }
      </mat-form-field>
      
    </div>
  `
})
export class EventInfoComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() showStatus = false;
}
