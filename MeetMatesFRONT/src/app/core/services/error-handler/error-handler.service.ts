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
        this.notification.showError('Impossible de contacter le serveur.');
        break;
      case 400: {
        const backendMsg =
          (typeof err.error === 'string'
            ? err.error
            : err.error?.message || err.error?.error);

        this.notification.showError(
          backendMsg || fallbackMessage || '❌ Requête invalide.'
        );
        break;
      }
      case 401:
        this.notification.showError('❌ Identifiants incorrects.');
        break;
      case 403:
        this.notification.showError('❌ Accès refusé ou session expirée.');
        break;
      case 409:
        this.notification.showWarning('❌ Cet email est déjà utilisé.');
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
