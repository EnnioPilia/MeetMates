import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationService } from '../notification/notification.service';

/**
 * Service centralisé chargé d'interpréter les erreurs HTTP renvoyées 
 * par le backend et d'afficher un message utilisateur cohérent.
 *
 * Il gère automatiquement :
 * - les erreurs API standardisées (ErrorDto) 
 * - les messages renvoyés par les filtres de sécurité (Security / JWT) 
 * - les statuts HTTP courants (400, 401, 403, 404, 409, 500) 
 * - les erreurs de connexion au serveur
 *
 * Pour chaque erreur, il tente d’extraire le champ `message` envoyé par l’API 
 * si aucun message n’est trouvé, un message par défaut est affiché.
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private notification = inject(NotificationService);

  /**
   * Gère une erreur HTTP et affiche un message utilisateur approprié.
   *
   * @param err Erreur HTTP reçue
   * @param fallbackMessage Message alternatif si aucun message backend n'est exploitable
   * @returns `true` si l'erreur a été traitée, `false` si elle doit être gérée ailleurs
   */
  handle(err: HttpErrorResponse, fallbackMessage?: string): boolean {
    const backendMessage = this.extractBackendMessage(err);
    let handled = true;

    switch (err.status) {
      case 0:
        this.notification.showError('Impossible de contacter le serveur.');
        break;

      case 400:
      case 401:
      case 403:
      case 404:
      case 409:
      case 500:
        this.notification.showError(
          backendMessage
          ?? fallbackMessage
          ?? this.getDefaultMessage(err.status)
        );
        break;

      default:
        handled = false;
        break;
    }

    return handled;
  }

  /**
   * Extrait le message d'erreur envoyé par le backend (champ `message`).
   * Retourne null si aucun message exploitable n'est présent.
   */
  private extractBackendMessage(err: HttpErrorResponse): string | null {
    const msg = err.error?.message;
    return typeof msg === 'string' ? msg : null;
  }

  /**
   * Retourne un message utilisateur par défaut correspondant au statut HTTP
   * lorsque le backend ne fournit aucun message exploitable.
   */
  private getDefaultMessage(status: number): string {
    switch (status) {
      case 400: return 'La requête est invalide.';
      case 401: return 'Vous devez vous authentifier.';
      case 403: return 'Accès refusé.';
      case 404: return 'Ressource introuvable.';
      case 409: return 'Conflit : modification impossible.';
      case 500: return 'Erreur interne du serveur.';
      default: return 'Une erreur inattendue est survenue.';
    }
  }
}
