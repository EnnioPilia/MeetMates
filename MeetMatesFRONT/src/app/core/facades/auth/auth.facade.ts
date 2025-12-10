import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap, of } from 'rxjs';

import { BaseFacade } from '../base/base.facade';

import { AuthService } from '../../services/auth/auth.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';

import { RegisterRequest } from '../../models/auth.model';

/**
* Facade centralisant toutes les actions d'authentification.
*
* Cette facade gère :
* - register / login / logout
* - reset & verify email
* - synchronisation UI : loader, messages, redirections, user signals
*
* Objectif : permettre aux composants d'être complètement "dumb" en déléguant la logique métier à la facade.
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
  * @returns Observable<any> observable de la réponse d'inscription
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
  * Authentifie un utilisateur et redirige vers /home
  * @param email Email de l'utilisateur
  * @param password Mot de passe de l'utilisateur
  * @returns Observable<any> observable de la réponse de connexion
  */
  login(email: string, password: string) {
    this.start();
    this.startLoading();

    return this.authService.login({ email, password }).pipe(
      tap(res => {
        this.notification.showSuccess(res.message);
        this.stop();
        this.stopLoading();
        this.router.navigate(['/home']);
      }),
      this.handleError(undefined, () => this.stop())
    );
  }

  /**
  * Demande l'envoi d'un email de réinitialisation de mot de passe
  * @param email Email de l'utilisateur
  * @returns Observable<any> observable de la réponse de demande
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
  * @param token Token reçu par email
  * @param newPassword Nouveau mot de passe
  * @returns Observable<any> observable de la réponse de réinitialisation
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
  * @param token Token de validation
  * @returns Observable<boolean> observable indiquant si la vérification a réussi
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
  * Déconnecte l'utilisateur, nettoie les données locales et redirige vers /login
  * @returns Observable<any> observable de la réponse de déconnexion
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
}
