// Angular
import { Injectable, signal } from '@angular/core';

// Core (models)
import { User } from '../../models/user.model';

/**
 * Modèle représentant les informations essentielles de l’utilisateur
 * actuellement connecté, stockées dans les Signals de l’application.
 */
export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string | null;
}

/**
 * Service centralisant l’état UI global de l’application (via Angular Signals).
 *
 * Responsabilités :
 * - Le titre de la page
 * - Le mode sombre
 * - L’état d’ouverture du menu
 * - L’utilisateur actuellement connecté
 */
@Injectable({ providedIn: 'root' })
export class SignalsService {

  /** Titre de la page courante affiché dans l’interface */
  readonly pageTitle = signal<string>('Accueil');

  /** État du mode sombre (true = activé) */
  readonly darkMode = signal<boolean>(false);

  /** Indique si le menu latéral est ouvert */
  readonly isMenuOpen = signal<boolean>(false);

  /** Informations de l’utilisateur actuellement connecté */
  readonly currentUser = signal<CurrentUser | null>(null);

  /**
   * Met à jour le titre de la page.
   * @param title Nouveau titre
   */
  setPageTitle(title: string) {
    this.pageTitle.set(title);
  }

  /** Réinitialise l'utilisateur courant (déconnexion). */
  clearCurrentUser() {
    this.currentUser.set(null);
  }

  /** Inverse l’état du mode sombre. */
  toggleDarkMode() {
    this.darkMode.update(v => !v);
  }

  /** Ouvre ou ferme le menu latéral. */
  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  /**
   * Met à jour le signal utilisateur à partir du modèle User complet.
   * 
   * @param user Objet User ou null si l'utilisateur n'est plus connecté
   */
  updateCurrentUser(user: User | null) {
    if (!user) {
      this.currentUser.set(null);
      return;
    }
    this.currentUser.set({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl ?? null
    });
  }

}
