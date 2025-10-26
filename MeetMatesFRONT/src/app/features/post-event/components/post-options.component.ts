import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-post-options',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  template: `
  
    <div [formGroup]="form" class="flex flex-col items-center gap-4 w-80">
      <div class="w-full flex flex-col items-start">
        <label class="block mb-2 text-gray-700">Matériel :</label>
        <mat-radio-group formControlName="materiel" class="flex flex-col items-start gap-1 w-full">
          <mat-radio-button
            *ngFor="let option of materialOptions"
            [value]="option.value"
            class="text-left">
            {{ option.label }}
          </mat-radio-button>
        </mat-radio-group>
      </div>

      <mat-form-field class="w-full">
        <mat-label>Nombre de participants</mat-label>
        <input matInput type="number" formControlName="participants" min="2" />
      </mat-form-field>

      <mat-form-field class="w-full">
        <mat-label>Niveau</mat-label>
        <mat-select formControlName="niveau">
          <mat-option *ngFor="let option of levelOptions" [value]="option.value">
            {{ option.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>

  `
})
export class PostOptionsComponent {
  @Input() form!: FormGroup;
  @Input() materialOptions: any[] = [];
  @Input() levelOptions: any[] = [];
}
