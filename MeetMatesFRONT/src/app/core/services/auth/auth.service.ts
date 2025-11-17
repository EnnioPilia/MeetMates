import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SignalsService } from '../signals/signals.service';
import { PasswordResetRequest, PasswordResetResponse } from '../../models/password-reset.model';

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
    return this.http.post<{ message: string; token: string }>(`${this.baseUrl}/login`, credentials, { withCredentials: true });
  }

  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(tap(() => this.signals.clearCurrentUser()));
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.baseUrl}/refresh-token`, {}, { withCredentials: true });
  }

  requestPasswordReset(data: PasswordResetRequest): Observable<HttpResponse<string>> {
    return this.http.post(`${this.baseUrl}/request-reset`, data, { observe: 'response', responseType: 'text' });
  }

  resetPassword(data: PasswordResetResponse): Observable<string> {
    return this.http.post(`${this.baseUrl}/reset-password`, data, { responseType: 'text' });
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/verify`, { params: { token } });
  }
}
