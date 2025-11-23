import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string | null;
}


@Injectable({ providedIn: 'root' })
export class SignalsService {
  readonly pageTitle = signal<string>('Accueil');
  readonly darkMode = signal<boolean>(false);
  readonly isMenuOpen = signal<boolean>(false);
  readonly currentUser = signal<CurrentUser | null>(null);

  setPageTitle(title: string) {
    this.pageTitle.set(title);
  }

  clearCurrentUser() {
    this.currentUser.set(null);
  }

  toggleDarkMode() {
    this.darkMode.update(v => !v);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

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
