import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../base/base.facade';

import { ActivityService } from '../../services/activity/activity.service';

import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';

/**
 * Facade dédiée à la gestion des activités et des catégories.
 *
 * Responsabilités :
 * - Expose un état applicatif prêt à l’emploi pour l’interface
 * - Centralise la récupération des données nécessaires à la navigation
 *   et à la sélection d’activités/catégories.
 */
@Injectable({ providedIn: 'root' })
export class ActivityFacade extends BaseFacade {
  private activityService = inject(ActivityService);
  readonly categories = signal<Category[]>([]);
  readonly activities = signal<Activity[]>([]);

  /** Charge toutes les catégories depuis l'API et met à jour l'état. */
  loadCategories() {
    this.startLoading();

    return this.activityService.fetchAllCategories().pipe(
      tap(categories => {
        this.categories.set(categories);
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /**
   * Met à jour la liste des activités associées à une catégorie sélectionnée.
   *
   * @param categoryId Identifiant de la catégorie active
   */
  loadActivities(categoryId: string) {
    this.startLoading();

    return this.activityService.fetchActivitiesByCategory(categoryId).pipe(
      tap(activities => {
        this.activities.set(activities);
        this.stopLoading();
      }),
      this.handleError()
    );
  }
}
