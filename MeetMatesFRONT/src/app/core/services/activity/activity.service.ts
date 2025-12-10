import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/api-response.model'; 

/**
 * Service responsable de la communication avec l'API pour les activités et les catégories.
 */
@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  
  /**
   * Récupère toutes les activités disponibles.
   * 
   * @returns Observable renvoyant un tableau d'activités
   */
  fetchAllActivities(): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/activity`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère toutes les activités correspondant à une catégorie donnée.
   *
   * @param categoryId - Identifiant de la catégorie
   * @returns Observable renvoyant un tableau d'activités filtrées
   */
  fetchActivitiesByCategory(categoryId: string): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/activity/category/${categoryId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère une activité spécifique par son identifiant.
   *
   * @param activityId - Identifiant de l'activité
   * @returns Observable renvoyant une activité
   */
  fetchActivityById(activityId: string): Observable<Activity> {
    return this.http.get<ApiResponse<Activity>>(`${this.baseUrl}/activity/${activityId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère toutes les catégories disponibles.
   *
   * @returns Observable renvoyant un tableau de catégories
   */
  fetchAllCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/category`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  /**
   * Récupère une catégorie spécifique par son identifiant.
   *
   * @param categoryId - Identifiant de la catégorie
   * @returns Observable renvoyant une catégorie
   */
  fetchCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/category/${categoryId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }
}
