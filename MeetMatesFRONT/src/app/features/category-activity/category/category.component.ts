import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Category } from '../../../core/models/category.model';
import { ErrorHandlerService } from '../../../core/services/error-handler/error-handler.service';
import { catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../../../shared-components/loading-spinner/loading-spinner.component'; 

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private activityService = inject(ActivityService);
  private destroyRef = inject(DestroyRef);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.activityService.fetchAllCategories()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors du chargement des catégories.');
          this.error.set('Erreur lors du chargement des catégories.');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(data => {
        this.categories = data;
        this.loading.set(false);
      });
  }

  navigateTo(categoryId: string): void {
    if (!categoryId) return;
    this.router.navigate([`/activity/${categoryId}`]);
  }
}
