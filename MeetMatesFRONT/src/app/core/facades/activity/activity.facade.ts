import { Injectable, inject, signal } from '@angular/core';
import { catchError, EMPTY, tap, throwError, finalize } from 'rxjs';

import { BaseFacade } from '../base/base.facade'; 

import { ActivityService } from '../../services/activity/activity.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class ActivityFacade extends BaseFacade {
  private activityService = inject(ActivityService);
  private errorHandler = inject(ErrorHandlerService);

  readonly categories = signal<Category[]>([]);
  readonly activities = signal<Activity[]>([]);

  loadCategories() {
    this.startLoading()

    return this.activityService.fetchAllCategories().pipe(
      tap(res => {
        this.categories.set(res);
        this.stopLoading();
      }),
      catchError(err => {
        this.errorHandler.handle(err);
        this.setError("Impossible de charger les catégories.");
        this.stopLoading();
        return EMPTY;
      })
    );
  }

  loadActivities(categoryId: string) {
    this.startLoading()

    return this.activityService.fetchActivitiesByCategory(categoryId).pipe(
      tap(res => {
        this.activities.set(res);
      }),
      catchError(err => {
        this.errorHandler.handle(err);
        this.setError("Impossible de charger les activités.");
        return throwError(() => err);
      }),
      finalize(() => {
        this.stopLoading();
      })
    );
  }

}
