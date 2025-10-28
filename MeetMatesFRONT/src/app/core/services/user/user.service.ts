import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + '/user';
  private http = inject(HttpClient);

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, { withCredentials: true });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  updateMyProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, user, { withCredentials: true });
  }

  uploadProfilePicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<User>(`${this.baseUrl}/me/picture`, formData, {
      withCredentials: true
    });
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url, { withCredentials: true });
  }

  deleteMyAccount() {
    return this.http.delete(`${this.baseUrl}/me`, { withCredentials: true });
  }

  deleteProfilePicture(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/photo`);
  }
}
