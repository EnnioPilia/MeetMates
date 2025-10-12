import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Activity } from '../../../core/models/activity.model';
import { BackButtonComponent } from '../../../shared/components-material-angular/back-button/back-button.component'; 

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgFor,BackButtonComponent],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  activities: Activity[] = [];
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router // 👈 ajouté
  ) {}

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
      error: (err) => console.error('Erreur API activities', err),
    });
  }

  goToEvents(activityId: string): void {
    this.router.navigate(['/events', activityId]); // 👈 redirection dynamique
  }
}
