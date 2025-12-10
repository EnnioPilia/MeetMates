import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RegisterRequest, PasswordResetRequest, PasswordResetConfirmRequest } from '../../models/auth.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Service responsable de la communication avec l'API d'authentification.
 *
 * Rôle :
 * - Gérer l'inscription, la connexion et la déconnexion
 * - Gérer la réinitialisation du mot de passe
 * - Vérifier les emails
 * - Utiliser les cookies HTTPOnly (withCredentials) pour les sessions
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/auth';
  private http = inject(HttpClient);

  /**
   * Authentifie un utilisateur à partir de ses identifiants.
   * @param credentials email + mot de passe
   * @returns Observable contenant un message et les cookies de session
   */
  login(credentials: { email: string; password: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  /**
  * Enregistre un nouvel utilisateur.
  * @param data données du formulaire d'inscription
  */
  register(data: RegisterRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/register`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Déconnecte l'utilisateur et détruit la session serveur.
   */
  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Rafraîchit la session via les cookies HttpOnly.
   * @returns Observable contenant un message (aucun accessToken dans le JSON)
   */
  refreshToken(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/refresh-token`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Demande l’envoi d’un email contenant un lien de réinitialisation.
   * @param data email de l'utilisateur
   */
  requestPasswordReset(data: PasswordResetRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/request-reset`,
      data
    );
  }

  /**
   * Réinitialise le mot de passe via le token reçu par email.
   * @param data token + nouveau mot de passe
   */
  resetPassword(data: PasswordResetConfirmRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/reset-password`,
      data
    );
  }

  /**
   * Vérifie le token envoyé par email après l'inscription.
   * @param token jeton de validation
   */
  verifyEmail(token: string): Observable<ApiResponse<null>> {
    return this.http.get<ApiResponse<null>>(
      `${this.baseUrl}/verify`,
      { params: { token } }
    );
  }
}
