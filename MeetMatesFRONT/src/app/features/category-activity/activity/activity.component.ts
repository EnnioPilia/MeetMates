import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { Activity } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity/activity.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, IconCardComponent],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})

export class ActivityComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);

  readonly error = signal<string | null>(null);
  activities: Activity[] = [];

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId) {
      this.loadActivities(categoryId);
    } else {
      this.error.set('Catégorie introuvable.');
    }
  }

  loadActivities(categoryId: string): void {
    this.activityService.fetchActivitiesByCategory(categoryId).subscribe({
      next: (data) => {
        this.activities = data;
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des activités.');
      }
    });
  }

  goToEvents(activityId: string): void {
    if (!activityId) {
      return;
    }
    this.router.navigate(['/events', activityId]);
  }
}
