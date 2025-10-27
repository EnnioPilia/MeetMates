import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {

  private baseUrl = environment.apiUrl;
  readonly error = signal<string | null>(null);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  activities: Activity[] = [];

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId) {
      this.loadActivities(categoryId);
    } else {
      console.error('categoryId est undefined');
    }
  }

  loadActivities(categoryId: string): void {
    this.http.get<Activity[]>(`${this.baseUrl}/activity/category/${categoryId}`).subscribe({
      next: (data) => (this.activities = data),
      error: (err) => {
        console.error('Erreur API activitées', err);
        this.error.set('Erreur lors du chargement des activitées.');
      }
    });
  }
  goToEvents(activityId: string): void {
    this.router.navigate(['/events', activityId]);
  }
}
