import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../base/base.facade';

import { ActivityService } from '../../services/activity/activity.service';
import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class ActivityFacade extends BaseFacade {

  private activityService = inject(ActivityService);

  readonly categories = signal<Category[]>([]);
  readonly activities = signal<Activity[]>([]);

  loadCategories() {
    this.startLoading();

    return this.activityService.fetchAllCategories().pipe(
      tap(categories => {
        this.categories.set(categories);
        this.stopLoading();
      }),
      this.handleError("Impossible de charger les catégories.")
    );
  }

  loadActivities(categoryId: string) {
    this.startLoading();

    return this.activityService.fetchActivitiesByCategory(categoryId).pipe(
      tap(activities => {
        this.activities.set(activities);
        this.stopLoading();
      }),
      this.handleError("Impossible de charger les activités.")
    );
  }
}
