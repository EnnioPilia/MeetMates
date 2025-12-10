import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

import { BaseFacade } from '../base/base.facade';

import { ActivityService } from '../../services/activity/activity.service';

import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';

/**
* Facade responsable de la gestion des catégories et activités.
*
* Cette facade :
* - Abstrait ActivityService
* - Fournit des signaux réactifs pour les composants
* - Gère le loading et les erreurs via BaseFacade
*/
@Injectable({ providedIn: 'root' })
export class ActivityFacade extends BaseFacade {
  private activityService = inject(ActivityService);

  /** Signal contenant la liste des catégories */
  readonly categories = signal<Category[]>([]);

  /** Signal contenant la liste des activités filtrées par catégorie */
  readonly activities = signal<Activity[]>([]);

  /**
  * Charge toutes les catégories depuis l'API et met à jour l'état.
  * @returns Observable<Category[]> observable des catégories
  */
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

  /**
  * Charge les activités associées à une catégorie.
  * @param categoryId ID de la catégorie
  * @returns Observable<Activity[]> observable des activités
  */
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
