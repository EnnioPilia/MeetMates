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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule
  ],
})
export class AppInputComponent<T = any> {
  @Input({ required: true }) label!: string;

  @Input() type: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' = 'text';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() icon?: string;
  @Input() min?: number;
  @Input() max?: number;
  @Input() maxLength?: number;

  private _control!: FormControl<T>;

  @Input({ required: true })
  set control(value: FormControl<T> | AbstractControl<T>) {
    this._control = value as FormControl<T>;
  }

  get control(): FormControl<T> {
    return this._control;
  }
}
