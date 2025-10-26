import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-text-fields',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `

    <div [formGroup]="form">
      <mat-form-field class="w-80">
        <mat-label>Titre</mat-label>
        <input matInput formControlName="titre" />
      </mat-form-field>

      <mat-form-field class="w-80">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
    </div>

  `
})
export class PostTextFieldsComponent {
  @Input() form!: FormGroup;
}
