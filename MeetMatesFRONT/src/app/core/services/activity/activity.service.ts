import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/api-response.model'; // crée ce modèle

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  fetchAllActivities(): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/activity`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  fetchActivitiesByCategory(categoryId: string): Observable<Activity[]> {
    return this.http.get<ApiResponse<Activity[]>>(`${this.baseUrl}/activity/category/${categoryId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  fetchActivityById(activityId: string): Observable<Activity> {
    return this.http.get<ApiResponse<Activity>>(`${this.baseUrl}/activity/${activityId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  fetchAllCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/category`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  fetchCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/category/${categoryId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }
}
