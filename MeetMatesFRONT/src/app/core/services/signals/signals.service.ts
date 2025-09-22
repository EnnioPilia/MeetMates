import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SignalsService {
  // 🔹 Titre de la page
  readonly pageTitle = signal<string>('Accueil');

  // 🔹 Dark mode
  readonly darkMode = signal<boolean>(false);

  // 🔹 Menu ouvert ou fermé
  readonly isMenuOpen = signal<boolean>(false);

  // ---- Méthodes pratiques ----
  setPageTitle(title: string) {
    this.pageTitle.set(title);
  }

  toggleDarkMode() {
    this.darkMode.update(v => !v);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
}
