import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
})
export class AppInputComponent {
  @Input({ required: true }) label!: string;
  private _control!: FormControl<any>;

  @Input({ required: true }) set control(value: FormControl<any> | AbstractControl<any, any>) {
    this._control = value as FormControl<any>;
  }
  get control(): FormControl<any> {
    return this._control;
  }
@Input() type: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' = 'text';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() icon?: string;
  @Input() min?: number;
  @Input() max?: number;
}
