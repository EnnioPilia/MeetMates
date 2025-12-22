import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './select.component.html'
})
export class AppSelectComponent {
  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() options: { label: string; value: any }[] = [];
  @Input() error = 'Champ requis';
}
