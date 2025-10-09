import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model'; // ajuste le chemin si besoin
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl + '/user'; // construction URL complète

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    console.log('Base URL:', this.baseUrl);

    return this.http.get<User[]>(this.baseUrl, { withCredentials: true });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/user/${user.id}`, user);
  }
  deleteUser(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    console.log('DELETE url:', url);
    return this.http.delete<void>(url, { withCredentials: true });
  }
}
