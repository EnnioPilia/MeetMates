import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { ActivityFacade } from '../../../core/facades/activity/activity.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

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

  loading = this.activityFacade.loading;
  error = this.activityFacade.error;
  categories = this.activityFacade.categories; 

  ngOnInit(): void {
    this.activityFacade.loadCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  navigateTo(categoryId: string) {
    this.router.navigate([`/activity/${categoryId}`]);
  }
}
