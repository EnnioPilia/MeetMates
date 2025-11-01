import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppInputComponent, AppButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col items-center gap-1 w-full">
      <app-input label="Prénom" [control]="form.get('firstName')!" type="text"></app-input>
      <app-input label="Nom" [control]="form.get('lastName')!" type="text"></app-input>
      <app-input label="Email" [control]="form.get('email')!" type="email"></app-input>
      <app-button 
        label="Enregistrer les modifications"
        class="primary-button w-80"
        type="submit"
        [disabled]="form.invalid || loading">
      </app-button>
    </form>
  `
})
export class EditProfileFormComponent implements OnInit {
  @Input({ required: true }) user!: User;
  @Output() save = new EventEmitter<Partial<User>>();

  private fb = inject(FormBuilder);

  form!: FormGroup;
  loading = false;

  ngOnInit() {
    this.form = this.fb.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.save.emit(this.form.value);
  }
}
