import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../models/users.model'; // ajuste le chemin si besoin
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl + '/users'; // construction URL complète

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<Users[]> {
    console.log('Base URL:', this.baseUrl);

    return this.http.get<Users[]>(this.baseUrl, { withCredentials: true });
  }

  getCurrentUser(): Observable<Users> {
    return this.http.get<Users>(`${this.baseUrl}/me`, { withCredentials: true });
  }

  updateUser(user: Users): Observable<Users> {
    return this.http.put<Users>(`${this.baseUrl}/users/${user.id}`, user);
  }
deleteUser(id: number): Observable<void> {
  const url = `${this.baseUrl}/${id}`;
  console.log('DELETE url:', url);
  return this.http.delete<void>(url, { withCredentials: true });
}


}
