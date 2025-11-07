import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Category } from '../../../core/models/category.model';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, IconCardComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  private router = inject(Router);
  private activityService = inject(ActivityService);

  readonly error = signal<string | null>(null);
  categories: Category[] = []; // ✅ plus d’erreur

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.activityService.fetchAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.error.set('Erreur lors du chargement des catégories.');
      }
    });
  }

  navigateTo(categoryId: string): void {
    if (!categoryId) {
      return;
    }
    this.router.navigate([`/activity/${categoryId}`]);
  }

}
