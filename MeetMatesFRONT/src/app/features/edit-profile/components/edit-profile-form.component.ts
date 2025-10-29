import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { UserService } from '../../../core/services/user/user.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    AppInputComponent, 
    AppButtonComponent],
  template: `

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col items-center gap-1 w-full">

      <app-input label="Prénom" [control]="form.get('firstName')!" type="text"></app-input>
      <app-input label="Nom" [control]="form.get('lastName')!" type="text"></app-input>
      <app-input label="Email" [control]="form.get('email')!" type="email"></app-input>

      <app-button label="Enregistrer les modifications"class="primary-button w-80"type="submit"[disabled]="form.invalid || loading"></app-button>

    </form>
  `
})
export class EditProfileFormComponent implements OnInit {
  @Input() user!: User;
  @Output() userUpdated = new EventEmitter<User>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notification = inject(NotificationService);

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
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez corriger les erreurs du formulaire.');
      return;
    }

    this.loading = true;
    const updatedUser: User = { ...this.user, ...this.form.value };

    this.userService.updateMyProfile(updatedUser).subscribe({
      next: (user) => {
        this.loading = false;
        this.userUpdated.emit(user);
      },
      error: () => {
        this.loading = false;
        this.notification.showError('❌ Erreur lors de la mise à jour du profil.');
      },
    });
  }
}
