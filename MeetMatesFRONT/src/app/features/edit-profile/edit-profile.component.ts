import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserFacade } from '../../core/facades/user/user.facade';
import { User } from '../../core/models/user.model';

import { EditProfilePictureComponent } from './components/edit-profile-picture.component';
import { EditProfileFormComponent } from './components/edit-profile-form.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    EditProfilePictureComponent,
    EditProfileFormComponent,
    StateHandlerComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  private userFacade = inject(UserFacade);
  
  readonly user = this.userFacade.user;
  readonly loading = this.userFacade.loading;
  readonly error = this.userFacade.error;

  ngOnInit() {
    this.userFacade.loadUser();
  }

  onSave(formValue: Partial<User>) {
    this.userFacade.updateMyProfile(formValue).subscribe();
  }

  onPhotoSelected(file: File) {
    this.userFacade.uploadProfilePicture(file).subscribe();
  }

  onPhotoDeleted() {
    this.userFacade.deleteProfilePicture().subscribe();
  }
}
