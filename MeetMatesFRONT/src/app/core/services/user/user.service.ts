import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Service dédié à la gestion du profil utilisateur.
 *
 * Rôle :
 * - Récupérer les informations du compte connecté
 * - Modifier les informations personnelles
 * - Gérer la photo de profil (upload / suppression)
 * - Supprimer le compte utilisateur
 *
 * Toutes les requêtes incluent les cookies HttpOnly via `withCredentials`.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + '/user';
  private http = inject(HttpClient);

  /**
   * Récupère les informations du profil utilisateur actuellement connecté.
   * @returns Observable contenant les données utilisateur
   */
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  /**
   * Met à jour le profil de l'utilisateur connecté.
   * @param user Données partielles à mettre à jour
   * @returns Observable contenant le profil mis à jour
   */
  updateMyProfile(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/me`, user, { withCredentials: true });
  }


  /**
   * Upload une nouvelle photo de profil pour l'utilisateur.
   * @param file Fichier image à envoyer
   * @returns Observable contenant l'utilisateur mis à jour
   */
  uploadProfilePicture(file: File): Observable<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/me/picture`, formData, { withCredentials: true });
  }

  /**
   * Supprime définitivement le compte de l'utilisateur connecté.
   * @returns Observable confirmant la suppression
   */
  deleteMyAccount(): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  /**
   * Supprime la photo de profil actuelle.
   * @returns Observable contenant l'utilisateur mis à jour
   */
  deleteProfilePicture(): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(`${this.baseUrl}/me/picture`, { withCredentials: true });
  }
}
