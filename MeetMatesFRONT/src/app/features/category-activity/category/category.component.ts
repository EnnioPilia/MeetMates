import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ActivityFacade } from '../../../core/facades/activity/activity.facade';

import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

/**
 * Composant UI chargé d’afficher la liste des catégories d’activités.
 *
 * Responsabilités :
 * - déclencher le chargement des catégories via `ActivityFacade`
 * - exposer les états (loading, erreur, données) à la vue
 * - gérer la navigation vers les activités d’une catégorie sélectionnée
 */
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    MatProgressSpinnerModule,
    StateHandlerComponent
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  
  private activityFacade = inject(ActivityFacade);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  /** États exposés par la facade */
  loading = this.activityFacade.loading;
  error = this.activityFacade.error;
  categories = this.activityFacade.categories; 

  /** Déclenche le chargement des catégories d’activités. */
  ngOnInit(): void {
    this.activityFacade.loadCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Navigue vers la liste des activités associées à une catégorie.
   *
   * @param categoryId Identifiant de la catégorie sélectionnée
   */
  navigateTo(categoryId: string): void {
    this.router.navigate([`/activity/${categoryId}`]);
  }
}
