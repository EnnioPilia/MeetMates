import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';

export interface AddressSuggestion {
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly apiUrl = 'https://api-adresse.data.gouv.fr/search/';
  private http = inject(HttpClient);

  getAddressSuggestions(query: string, limit = 5) {
    if (!query || query.trim().length < 3) {
      return of<AddressSuggestion[]>([]);
    }

    return this.http.get<any>(this.apiUrl, { params: { q: query, limit } }).pipe(
      map((data) =>
        data.features.map((f: any) => ({
          label: f.properties.label
        }))
      ),
      catchError(() => of<AddressSuggestion[]>([]))
    );
  }
}
