import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../signals/signals.service';
import { User } from '../../models/user.model';

export interface RegisterRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  age?: number;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/auth';
  private http = inject(HttpClient);
  private signals = inject(SignalsService);

  login(credentials: { email: string; password: string }): Observable<{ message: string; token: string }> {
    return this.http.post<{ message: string; token: string }>(`${this.baseUrl}/login`, credentials, { withCredentials: true }
    ).pipe(
      catchError(err => {
        return throwError(() => new Error(err?.error?.message || 'Échec de l\'authentification.'));
      })
    );
  }

  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' }).pipe(
      catchError(err => {
        return throwError(() => new Error(err?.error?.error || 'Erreur lors de l\'inscription.'));
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.signals.clearCurrentUser(); 
      }),
      catchError(err => {
        return throwError(() => new Error(err?.error?.message || 'Erreur lors de la déconnexion.'));
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.baseUrl}/refresh-token`, {}, { withCredentials: true }
    );
  }

  requestPasswordReset(email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/request-reset`, { email }, { responseType: 'text' }).pipe(
      catchError(err => {
        return throwError(() => new Error(err?.error || 'Erreur lors de la demande de réinitialisation.'));
      })
    );
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, data, { responseType: 'text' }).pipe(
      catchError(err => {
        return throwError(() => new Error(err?.error || 'Erreur lors de la réinitialisation du mot de passe.'));
      })
    );
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/verify`, {
      params: { token }
    }).pipe(
      catchError(err => {
        return throwError(() => new Error(err?.error?.message || 'Erreur lors de la vérification du compte.'));
      })
    );
  }
}
