import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { IconCardComponent } from '../../../shared-components/icon-card/icon-card.component';

interface Category {
  categoryId: string;
  name: string;
  imageUrl?: string;
  icon?: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, IconCardComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/category';
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly error = signal<string | null>(null);
  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<Category[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
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
