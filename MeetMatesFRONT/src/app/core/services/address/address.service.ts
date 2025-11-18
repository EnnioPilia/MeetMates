import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface AddressSuggestion {
  label: string;
}

interface ApiAdresseResponse {
  features: { properties: { label: string } }[];
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly apiUrl = 'https://api-adresse.data.gouv.fr/search/';
  private http = inject(HttpClient);

  getAddressSuggestions(query: string, limit = 5): Observable<AddressSuggestion[]> {
    if (!query || query.trim().length < 3) {
      return of<AddressSuggestion[]>([]);
    }

    return this.http.get<ApiAdresseResponse>(this.apiUrl, { params: { q: query, limit } }).pipe(
      map((data) =>
        data.features.map((f) => ({
          label: f.properties.label
        }))
      ),
      catchError(() => of<AddressSuggestion[]>([]))
    );
  }
}
