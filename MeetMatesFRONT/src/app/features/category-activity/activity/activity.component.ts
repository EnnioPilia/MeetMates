import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '../../../shared-components/loading-spinner/loading-spinner.component';
import { ActivityFacade } from '../../../core/facades/activity/activity.facade';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  private activityFacade = inject(ActivityFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  loading = this.activityFacade.loading;
  error = this.activityFacade.error;
  activities = this.activityFacade.activities;

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    
    if (!categoryId) {
      return;
    }

    this.activityFacade.loadActivities(categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }


  goToEvents(activityId: string) {
    this.router.navigate(['/events', activityId]);
  }
}
