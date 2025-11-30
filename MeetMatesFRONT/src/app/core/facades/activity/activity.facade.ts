import { Injectable, inject, signal } from '@angular/core';
import { catchError, EMPTY, tap, throwError, finalize } from 'rxjs';

import { ActivityService } from '../../services/activity/activity.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class ActivityFacade {

  private activityService = inject(ActivityService);
  private errorHandler = inject(ErrorHandlerService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly categories = signal<Category[]>([]);
  readonly activities = signal<Activity[]>([]);

  loadCategories() {
    this.loading.set(true);
    this.error.set(null);

    return this.activityService.fetchAllCategories().pipe(
      tap(res => {
        this.categories.set(res);
        this.loading.set(false);
      }),
      catchError(err => {
        this.errorHandler.handle(err);
        this.error.set("Impossible de charger les catégories.");
        this.loading.set(false);
        return EMPTY;
      })
    );
  }

  loadActivities(categoryId: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.activityService.fetchActivitiesByCategory(categoryId).pipe(
      tap(res => {
        this.activities.set(res);
      }),
      catchError(err => {
        this.errorHandler.handle(err);
        this.error.set("Impossible de charger les activités.");
        return throwError(() => err);
      }),
      finalize(() => {
        this.loading.set(false);
      })
    );
  }

}
