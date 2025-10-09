import { Injectable, signal } from '@angular/core';

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

  // 👇 ajout du signal utilisateur
  readonly currentUser = signal<CurrentUser | null>(null);

  setPageTitle(title: string) {
    this.pageTitle.set(title);
  }

  setCurrentUser(user: CurrentUser) {
    this.currentUser.set(user);
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
}
