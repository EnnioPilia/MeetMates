// Angular
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

// Angular Material
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

// Shared components
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { MaterialOption, LevelOption } from '../../../shared-components/constants/event-option';

/**
 * Sous-composant de formulaire dédié aux options
 * avancées de l’événement.
 *
 * Responsabilités :
 * - sélection du matériel requis
 * - sélection du niveau
 * - saisie du nombre de participants
 * - affichage des erreurs de validation
 */
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
    ReactiveFormsModule,
    AppInputComponent
  ],
  template: `
  
      <div [formGroup]="form" class="flex flex-col items-center gap-4 w-80">
        <div class="w-full flex flex-col items-start">
          <label class="block mb-2 text-gray-700">Matériel :</label>

          <mat-radio-group formControlName="materiel" class="flex flex-col items-start gap-1 w-full">
            @for (option of materialOptions; track option.value) {
              <mat-radio-button [value]="option.value">
                {{ option.label }}
              </mat-radio-button>
            }
          </mat-radio-group>

          @if (form.get('materiel')?.hasError('required') && (form.get('materiel')?.touched || form.get('materiel')?.dirty)) {
            <mat-error>Veuillez choisir une option de matériel.</mat-error>
          }
        </div>

          <app-input
            label="Nombre de participants"
            [control]="form.get('participants')!"
            type="number"
            [required]="true"
            [min]="2">
          </app-input>

        <mat-form-field class="w-full">
          <mat-label>Niveau</mat-label>
          <mat-select formControlName="niveau">
            @for (option of levelOptions; track option.value) {
              <mat-option [value]="option.value">
                {{ option.label }}
              </mat-option>
            }
          </mat-select>

          @if (form.get('niveau')?.hasError('required') && (form.get('niveau')?.touched || form.get('niveau')?.dirty)) {
            <mat-error>Veuillez sélectionner un niveau.</mat-error>
          }
        </mat-form-field>
      </div>

  `
})
export class PostOptionsComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() materialOptions: MaterialOption[] = [];
  @Input() levelOptions: LevelOption[] = [];
}
