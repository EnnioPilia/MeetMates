// Angular
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap, of } from 'rxjs';

// Core (facades, services, models)
import { BaseFacade } from '../base/base.facade';
import { AuthService } from '../../services/auth/auth.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { RegisterRequest } from '../../models/auth.model';

/**
 * Facade responsable de la gestion du cycle d’authentification utilisateur.
 *
 * Cette facade centralise les cas d’usage liés à l’authentification et expose
 * une API simple destinée aux composants de l’application.
 *
 * Responsabilités :
 * - gérer l’inscription, la connexion et la déconnexion des utilisateurs
 * - orchestrer la réinitialisation et la validation des mots de passe
 * - synchroniser l’état global de l’application après authentification
 *   (loader, notifications, utilisateur courant, navigation)
 */
@Injectable({ providedIn: 'root' })
export class AuthFacade extends BaseFacade {
  private authService = inject(AuthService);
  private signals = inject(SignalsService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  /** Indique si un formulaire d'authentification est en cours de soumission */
  isSubmitting = false;
  private start() { this.isSubmitting = true; }
  private stop() { this.isSubmitting = false; }

  /**
  * Enregistre un nouvel utilisateur
  * @param payload Données de l'utilisateur à enregistrer
  */
  register(payload: RegisterRequest) {
    this.start();
    this.startLoading();

    return this.authService.register(payload).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError(undefined, () => this.stop())
    );
  }

  /**
  * Authentifie un utilisateur à partir de ses identifiants
  * et redirige vers /home
  * 
  * @param email Email de l'utilisateur
  * @param password Mot de passe de l'utilisateur
  */
  login(email: string, password: string) {
    this.start();
    this.startLoading();

    return this.authService.login({ email, password }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
      }),
      switchMap(() => this.loadCurrentUser()), 
      tap(() => {
        this.stop();
        this.stopLoading();
        this.router.navigate(['/home']);
      }),
      this.handleError(undefined, () => this.stop())
    );

  }

  /**
  * Demande l'envoi d'un email de réinitialisation de mot de passe
  * 
  * @param email Email de l'utilisateur
  */
  requestPasswordReset(email: string) {
    this.start();
    this.startLoading();

    return this.authService.requestPasswordReset({ email }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }

  /**
  * Réinitialise le mot de passe à partir du token
  * 
  * @param token Token reçu par email
  * @param newPassword Nouveau mot de passe
  */
  resetPassword(token: string, newPassword: string) {
    this.start();
    this.startLoading();

    return this.authService.resetPassword({ token, newPassword }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }

  /**
  * Vérifie le token de validation d'email
  * 
  * @param token Token de validation
  */
  verifyEmail(token: string) {
    this.start();
    this.startLoading();

    return this.authService.verifyEmail(token).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
      }),
      switchMap(() => of(true)),
      this.handleError()
    );
  }

  /** 
   * Déconnecte l'utilisateur, nettoie les données locales 
   * et redirige vers /login 
   */
  logout() {
    this.start();
    this.startLoading();

    return this.authService.logout().pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.signals.clearCurrentUser();
        this.stop();
        this.stopLoading();
        this.router.navigate(['/login']);
      }),
      this.handleError()
    );
  }

  loadCurrentUser() {
    return this.authService.getMe().pipe(
      tap(user => {
        this.signals.updateCurrentUser(user);
      })
    );
  }

}
