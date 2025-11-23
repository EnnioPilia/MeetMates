import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisterRequest, ApiResponse, PasswordResetRequest, PasswordResetConfirmRequest } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/auth';
  private http = inject(HttpClient);

  /* LOGIN — retourne juste message + cookies */
  login(credentials: { email: string; password: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  /* REGISTER */
  register(data: RegisterRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/register`,
      data,
      { withCredentials: true }
    );
  }

  /* LOGOUT */
  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  /* REFRESH TOKEN — pas d'accessToken dans le JSON */
  refreshToken(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/refresh-token`,
      {},
      { withCredentials: true }
    );
  }

  /* REQUEST RESET PASSWORD */
  requestPasswordReset(data: PasswordResetRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/request-reset`,
      data
    );
  }

  /* RESET PASSWORD — token + newPassword */
  resetPassword(data: PasswordResetConfirmRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/reset-password`,
      data
    );
  }

  /* VERIFY EMAIL */
  verifyEmail(token: string): Observable<ApiResponse<null>> {
    return this.http.get<ApiResponse<null>>(
      `${this.baseUrl}/verify`,
      { params: { token } }
    );
  }
}
