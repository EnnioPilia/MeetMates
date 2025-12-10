import { Injectable, inject } from '@angular/core';

import { NotificationService } from '../notification/notification.service';

/**
 * Service centralisé pour gérer l’affichage des messages de succès.
 *
 * Rôle :
 * - Extraire automatiquement le message renvoyé par le backend
 * - Afficher une notification de succès cohérente dans toute l’application
 * - Permettre un fallback si aucun message n’est présent
 * - Possibilité de désactiver l'affichage (mode silencieux)
 */
@Injectable({ providedIn: 'root' })
export class SuccessHandlerService {
  private notification = inject(NotificationService);

  /**
   * Affiche un message de succès basé sur la réponse du backend.
   *
   * @param res Réponse renvoyée par l'API (doit contenir un champ `message`)
   * @param fallbackMessage Message utilisé si aucun message n’est fourni
   * @param options `{ silent: true }` pour désactiver toute notification
   */
  handle(
    res: unknown,
    fallbackMessage?: string,
    options?: { silent?: boolean }
  ): void {
    if (options?.silent) return;

    const message = (res as any)?.message;

    this.notification.showSuccess(
      typeof message === 'string'
        ? message
        : fallbackMessage ?? '✔️ Opération effectuée avec succès.'
    );
  }
}