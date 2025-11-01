import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';

export interface AddressSuggestion {
  display_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly apiUrl = 'https://api-adresse.data.gouv.fr/search/';

  constructor(private http: HttpClient) {}

  getAddressSuggestions(query: string, limit = 5) {
    if (!query || query.trim().length < 3) {
      // Retourne un observable vide pour éviter les erreurs d’abonnement
      return of<AddressSuggestion[]>([]);
    }

    return this.http.get<any>(this.apiUrl, { params: { q: query, limit } }).pipe(
      map((data) =>
        data.features.map((f: any) => ({
          display_name: f.properties.label
        }))
      ),
      catchError(() => of<AddressSuggestion[]>([]))
    );
  }
}
