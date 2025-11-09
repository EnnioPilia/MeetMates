import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { Activity } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { ErrorHandlerService } from '../../../core/services/error-handler/error-handler.service';
import { catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [
    CommonModule,
    IconCardComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private activityService = inject(ActivityService);
  private errorHandler = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);

  activities: Activity[] = [];

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);

    const categoryId = this.route.snapshot.paramMap.get('categoryId');

    if (categoryId) {
      this.loadActivities(categoryId);
    } else {
      this.error.set('Erreur lors du chargement des activités.');
      this.loading.set(false);
    }
  }

  loadActivities(categoryId: string): void {
    this.activityService.fetchActivitiesByCategory(categoryId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => {
          this.errorHandler.handle(err, '❌ Erreur lors du chargement des activités.');
          this.error.set('Erreur lors du chargement.');
          this.loading.set(false);
          return EMPTY;
        })
      )
      .subscribe(data => {
        this.activities = data;
        this.loading.set(false);
      });
  }

  goToEvents(activityId: string): void {
    if (!activityId) return;
    this.router.navigate(['/events', activityId]);
  }
}
