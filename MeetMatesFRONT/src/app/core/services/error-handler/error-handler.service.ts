import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification/notification.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private notification = inject(NotificationService);

  handle(err: HttpErrorResponse, fallbackMessage?: string): boolean {
    let handled = true;

    switch (err.status) {
      case 0:
        this.notification.showError('❌ Impossible de contacter le serveur.');
        break;
      case 400:
        this.notification.showError('❌ Requête invalide.');
        break;
      case 401:
        this.notification.showError('❌ Mot de passe incorrect.');
        break;
      case 403:
        this.notification.showError('❌ Accès refusé ou session expirée.');
        break;
      case 404:
        this.notification.showError('❌ Aucun compte trouvé avec cet email.');
        break;
      case 409:
        this.notification.showWarning('❌ Cet email est déjà utilisé.');
        break;
      case 500:
        this.notification.showError('❌ Erreur serveur. Veuillez réessayer plus tard.');
        break;
      default:
        handled = false;
        break;
    }
    if (!handled && fallbackMessage) {
      this.notification.showError(fallbackMessage);
      handled = true;
    }
    return handled;
  }
}
