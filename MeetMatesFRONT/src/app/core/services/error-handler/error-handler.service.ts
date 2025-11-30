import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private notification = inject(NotificationService);

  handle(err: HttpErrorResponse, fallbackMessage?: string): boolean {
    const backendMessage = this.extractBackendMessage(err);
    let handled = true;

    switch (err.status) {
      case 0:
        this.notification.showError(' Impossible de contacter le serveur.');
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

  // Extraction fiable du message backend
  private extractBackendMessage(err: HttpErrorResponse): string | null {
    try {
      const e = err.error;

      // 🔹 cas : string JSON envoyé par le back
      if (typeof e === 'string') {
        try {
          const parsed = JSON.parse(e);
          return parsed.message || parsed.error || parsed.msg || null;
        } catch {
          return e; // string simple envoyée par le back
        }
      }

      // 🔹 cas : object
      if (typeof e === 'object' && e !== null) {
        return (
          e.message ||
          e.error ||
          e.msg ||
          (typeof e.error === 'object' ? e.error.message : null) ||
          null
        );
      }
      return null;
    } catch {
      return null;
    }
  }


  private getDefaultMessage(status: number): string {
    switch (status) {
      case 400: return ' La requête est invalide.';
      case 401: return ' Vous devez vous authentifier.';
      case 403: return ' Accès refusé.';
      case 404: return ' Ressource introuvable.';
      case 409: return ' Conflit : modification impossible.';
      case 500: return ' Erreur interne du serveur.';
      default: return ' Une erreur inattendue est survenue.';
    }
  }
}
