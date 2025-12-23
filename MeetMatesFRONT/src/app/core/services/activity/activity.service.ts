// Angular
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Varible d'environment
import { environment } from '../../../../environments/environment';

// Core (models)
import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/api-response.model';

/**
 * Service responsable de la communication avec l'API pour les activités et les catégories.
 *
 * Responsabilités :
 * - Récupérer la liste des activités
 * - Récupérer les activités par catégorie
 * - Récupérer le détail d'une activité
 * - Récupérer les catégories disponibles
 *  
 * Requêtes authentifiées via cookies HttpOnly (requêtes avec `withCredentials`)
 */
@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /** Récupère toutes les activités disponibles. */
  fetchAllActivities(): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/activity`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère toutes les activités correspondant à une catégorie donnée.
   *
   * @param categoryId - Identifiant de la catégorie
   */
  fetchActivitiesByCategory(categoryId: string): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/activity/category/${categoryId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère une activité spécifique par son identifiant.
   *
   * @param activityId - Identifiant de l'activité
   */
  fetchActivityById(activityId: string): Observable<Activity> {
    return this.http.get<ApiResponse<Activity>>(`${this.baseUrl}/activity/${activityId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /** Récupère toutes les catégories disponibles. */
  fetchAllCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/category`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère une catégorie spécifique par son identifiant.
   *
   * @param categoryId - Identifiant de la catégorie
   */
  fetchCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/category/${categoryId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }
}
