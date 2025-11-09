import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AppInputComponent } from '../../../shared-components/input/input.component';

@Component({
  selector: 'app-post-text-fields',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, AppInputComponent],
  template: `

    <div [formGroup]="form"  class="flex flex-col items-center gap-4 w-80">

      <app-input
        label="Titre"
        [control]="form.controls['titre']"
        [required]="true" type="text">
      </app-input>

      <mat-form-field class="w-80">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="4"></textarea>
          @if (form.get('description')?.hasError('required') && (form.get('description')?.touched || form.get('description')?.dirty)) {
          <mat-error>Description est requise.</mat-error>
        }
      </mat-form-field>
      
    </div>
  `
})
export class PostTextFieldsComponent {
  @Input() form!: FormGroup;
}
