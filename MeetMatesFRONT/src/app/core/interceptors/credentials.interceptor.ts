// Angular
import { HttpInterceptorFn } from '@angular/common/http';

// Varible d'environment
import { environment } from '../../../environments/environment';

/**
 * Intercepteur HTTP chargé d’attacher les credentials
 * (cookies HttpOnly) aux requêtes destinées à l’API backend.
 *
 * Objectif :
 * - garantir l’envoi automatique des cookies d’authentification
 *   pour les appels vers l’API
 * - éviter toute fuite de credentials vers des URLs externes
 *
 * Fonctionnement :
 * - intercepte uniquement les requêtes ciblant `environment.apiUrl`
 * - ajoute l’option `withCredentials: true`
 *
 * Sécurité :
 * - aucune logique d’authentification côté frontend
 * - la validation des permissions reste exclusivement côté backend
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return next(
    req.clone({
      withCredentials: true
    })
  );
};
