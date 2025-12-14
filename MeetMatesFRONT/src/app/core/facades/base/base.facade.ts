import { signal, inject } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';

import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

/**
 * Facade de base mutualisant les mécanismes transverses des facades métiers.
 * 
 * Elle centralise :
 * - l’état de chargement global
 * - la gestion uniforme des erreurs
 * - la délégation du traitement des erreurs au service dédié
 */
export abstract class BaseFacade {
  private errorHandler = inject(ErrorHandlerService);

  /** Indique si une opération est en cours */
  readonly loading = signal(false);
  
  /** Contient le message d'erreur courant (ou null) */
  readonly error = signal<string | null>(null);

  /** Active le loader et réinitialise l'erreur */
  protected startLoading() {
    this.loading.set(true);
    this.error.set(null);
  }

  /** Désactive le loader */
  protected stopLoading() {
    this.loading.set(false);
  }

  /** Définit un message d'erreur manuel */
  protected setError(message: string) {
    this.error.set(message);
  }

  /**
  * Fournit un pipeline de gestion d’erreurs standardisé pour les facades.
  *
  * - Affiche les messages d'erreur via ErrorHandlerService
  * - Met à jour `error` si un message custom est fourni
  * - Stoppe automatiquement le loader
  * - Appelle la méthode `stop()` si la facade en possède une
  * - Exécute optionnellement un callback `onFinally`
  *
  * @param message Message d'erreur personnalisé affiché dans le signal `error`
  * @param onFinally Callback optionnel exécuté après la gestion de l'erreur
  */
  protected handleError<T>(message?: string, onFinally?: () => void) {
    return (source: Observable<T>) =>
      source.pipe(
        catchError(err => {
          this.errorHandler.handle(err);

          if (message) {
            this.setError(message);
          }

          this.stopLoading();

          if (typeof (this as any).stop === 'function') {
            (this as any).stop();
          }

          if (onFinally) {
            onFinally();
          }

          return of(null as T);
        })
      );
  }

}
