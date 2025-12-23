// Angular
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

/** Représente une suggestion d'adresse retournée par l'API publique. */
export interface AddressSuggestion {
  label: string;
  street: string;
  city: string;
  postalCode: string;
}

/** Structure interne de la réponse retournée par api-adresse.data.gouv.fr. */
interface ApiAdresseResponse {
  features: {
    properties: {
      label: string;
      name: string;
      city: string;
      postcode: string;
    };
  }[];
}

/**
 * Service responsable de l’autocomplétion d’adresses via l’API
 * api-adresse.data.gouv.fr.
 *
 * Responsabilités :
 * - Interroger l’API publique d’adresses
 * - Mapper les résultats pour ne renvoyer que les suggestions utiles
 * - Gérer les erreurs en renvoyant une liste vide
 */
@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly apiUrl = 'https://api-adresse.data.gouv.fr/search/';
  private http = inject(HttpClient);

  /**
   * Récupère des suggestions d'adresses selon un texte de recherche.
   *
   * - Ne fait aucun appel API si moins de 3 caractères (optimisation)
   * - Renvoie une liste vide en cas d'erreur réseau
   *
   * @param query Texte à rechercher (minimum 3 caractères)
   * @param limit Nombre maximum de résultats (défaut : 5)
   * @returns Observable contenant une liste de suggestions d'adresses
   */
  getAddressSuggestions(query: string, limit = 5): Observable<AddressSuggestion[]> {
    if (!query || query.trim().length < 3) {
      return of<AddressSuggestion[]>([]);
    }

    return this.http.get<ApiAdresseResponse>(this.apiUrl, { params: { q: query, limit } }).pipe(
      map((data) =>
        data.features.map((f) => ({
          label: f.properties.label,
          street: f.properties.name,
          city: f.properties.city,
          postalCode: f.properties.postcode
        }))
      ),
      catchError(() => of<AddressSuggestion[]>([]))
    );
  }
}
