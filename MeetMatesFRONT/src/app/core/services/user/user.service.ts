import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + '/user';
  private http = inject(HttpClient);

  /** Récupérer le profil utilisateur */
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  /** Mise à jour du profil */
  updateMyProfile(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/me`, user, { withCredentials: true });
  }

  /** Upload photo de profil */
  uploadProfilePicture(file: File): Observable<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/me/picture`, formData, {
      withCredentials: true
    });
  }

  /** Suppression du compte */
  deleteMyAccount(): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/me`, {
      withCredentials: true
    });
  }

  /** Suppression photo de profil */
  deleteProfilePicture(): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(`${this.baseUrl}/me/picture`, {
      withCredentials: true
    });
  }
}
