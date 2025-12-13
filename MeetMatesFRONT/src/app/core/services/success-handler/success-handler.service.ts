import { Injectable, inject } from '@angular/core';

import { NotificationService } from '../notification/notification.service';

/**
 * Service centralisé chargé d'afficher les messages de succès renvoyés
 * par le backend et d'assurer une expérience utilisateur cohérente.
 *
 * Il gère automatiquement :
 * - les réponses API standardisées contenant un champ `message`
 * - les variations de structure possibles (`message`, `msg`, `detail`, etc.)
 * - le fallback automatique si aucun message n'est fourni
 * - la désactivation volontaire de la notification (mode silencieux)
 * 
 * Pour chaque succès, il tente d’extraire le champ `message` envoyé par l’API 
 * si aucun message n’est trouvé, un message par défaut est affiché.
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