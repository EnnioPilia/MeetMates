import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model'; 

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

  updateCurrentUser(user: User) {
    this.currentUser.set({
      id: String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
}
