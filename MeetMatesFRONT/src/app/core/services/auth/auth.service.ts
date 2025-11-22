import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RegisterRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  age?: number;
  role?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginResponse extends MessageResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/auth';
  private http = inject(HttpClient);

  login(credentials: { email: string; password: string }): Observable<{ message: string; token: string }> {
    return this.http.post<{ message: string; token: string }>(
      `${this.baseUrl}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  /* REGISTER */
  register(data: RegisterRequest): Observable<MessageResponse>{
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/register`,
      data,
      { withCredentials: true }
    );
  }

  /* LOGOUT */
  logout(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  /* REFRESH TOKEN */
  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.baseUrl}/refresh-token`,
      {},
      { withCredentials: true }
    );
  }

  /* REQUEST PASSWORD RESET */
  requestPasswordReset(data: PasswordResetRequest): Observable<MessageResponse> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/request-reset`,
      data
    );
  }

  /* RESET PASSWORD  */
  resetPassword(data: PasswordResetResponse): Observable<MessageResponse> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/reset-password`,
      data
    );
  }

  /* VERIFY EMAIL */
  verifyEmail(token: string) :Observable<MessageResponse> {
    return this.http.get<{ message: string }>(
      `${this.baseUrl}/verify`,
      { params: { token } }
    );
  }
}
