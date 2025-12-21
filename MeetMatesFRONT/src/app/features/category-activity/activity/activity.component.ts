// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Angular Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Core (facades)
import { ActivityFacade } from '../../../core/facades/activity/activity.facade';

// Shared components
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

/**
 * Composant UI chargé d’afficher les activités d’une catégorie.
 *
 * Responsabilités :
 * - récupérer l’identifiant de catégorie depuis la route
 * - déclencher le chargement des activités via `ActivityFacade`
 * - exposer les états (loading, erreur, données) à la vue
 * - gérer la navigation vers la liste des événements
 *
 */
@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    MatProgressSpinnerModule,
    StateHandlerComponent
  ],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  
  private activityFacade = inject(ActivityFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  /** États exposés par la facade */
  loading = this.activityFacade.loading;
  error = this.activityFacade.error;
  activities = this.activityFacade.activities;

  /**
   * Initialise le composant :
   * - extrait l’identifiant de catégorie depuis la route
   * - déclenche le chargement des activités associées via la facade
   */
  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');

    if (!categoryId) {
      return;
    }

    this.activityFacade.loadActivities(categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Navigue vers la liste des événements liés à une activité.
   * 
   * @param activityId Identifiant de l’activité sélectionnée
   */
  goToEvents(activityId: string): void {
    this.router.navigate(['/events', activityId]);
  }
}
