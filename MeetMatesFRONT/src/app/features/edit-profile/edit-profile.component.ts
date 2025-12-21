// Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core (facades, models)
import { UserFacade } from '../../core/facades/user/user.facade';
import { User } from '../../core/models/user.model';

// Feature components
import { EditProfilePictureComponent } from './components/edit-profile-picture.component';
import { EditProfileFormComponent } from './components/edit-profile-form.component';

// Shared components
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

/**
 * Composant parent chargé de l’édition du profil utilisateur.
 *
 * Responsabilités :
 * - charger les données du profil via `UserFacade`
 * - exposer les états (utilisateur, chargement, erreur) à la vue
 * - orchestrer la mise à jour des informations personnelles
 * - gérer la mise à jour et la suppression de la photo de profil
 *
 * Architecture :
 * - `EditProfilePictureComponent` : sélection, upload et suppression de la photo
 * - `EditProfileFormComponent` : édition des informations utilisateur
 */
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

  /** États exposés par la facade */
  readonly user = this.userFacade.user;
  readonly loading = this.userFacade.loading;
  readonly error = this.userFacade.error;

  /** Déclenche le chargement du profil utilisateur au montage du composant. */
  ngOnInit() {
    this.userFacade.loadUser().subscribe();
  }

  /**
   * Soumet les modifications des informations utilisateur.
   *
   * @param formValue Données partielles du profil à mettre à jour
   */
  onSave(formValue: Partial<User>) {
    this.userFacade.updateMyProfile(formValue).subscribe();
  }

  /**
   * Gère la sélection d’une nouvelle photo de profil.
   *
   * @param file Fichier image sélectionné par l’utilisateur
   */
  onPhotoSelected(file: File) {
    this.userFacade.uploadProfilePicture(file).subscribe();
  }

  /** Supprime la photo de profil actuelle de l’utilisateur. */
  onPhotoDeleted() {
    this.userFacade.deleteProfilePicture().subscribe();
  }
}
