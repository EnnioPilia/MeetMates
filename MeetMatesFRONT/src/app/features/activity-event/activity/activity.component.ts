import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';

export interface Activity {
  id: string;
  name: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}


@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgFor],

  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  activities: Activity[] = [];
  categoryId!: string;
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId) {
      this.loadActivities(categoryId);
    } else {
      console.error('categoryId est undefined');
    }
  }

  loadActivities(categoryId: string): void {
    this.http.get<Activity[]>(`${this.baseUrl}/activity/category/${categoryId}`)
      .subscribe({
        next: data => this.activities = data,
        error: err => console.error('Erreur API activities', err)
      });
  }
}
