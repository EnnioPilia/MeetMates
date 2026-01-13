// Angular
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

// Core (services)
import { SignalsService } from '../services/signals/signals.service';

/**
 * Guard de navigation dédié à l’UX d’administration.
 *
 * Ce guard ne constitue PAS une mesure de sécurité.
 * La sécurité et la validation des permissions
 * sont entièrement gérées côté backend.
 *
 * Responsabilités :
 * - empêcher l’accès aux routes admin si l’utilisateur
 *   n’est pas authentifié
 * - restreindre l’accès aux utilisateurs non administrateurs
 * - rediriger vers des pages appropriées (login / forbidden)
 *
 * Utilisation :
 * - protection des routes `/admin/**`
 * - amélioration de l’expérience utilisateur
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard {

  private signals = inject(SignalsService);
  private router = inject(Router);
  
  /**
   * Détermine si la route peut être activée.
   *
   * @returns `true` si l’utilisateur est authentifié et administrateur,
   * `false` sinon (avec redirection UX)
   */
  canActivate(): boolean {
    if (!this.signals.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.signals.isAdmin()) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
