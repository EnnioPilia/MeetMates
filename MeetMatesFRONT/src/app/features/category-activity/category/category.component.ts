import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment';

interface Category {
  categoryId: string;
  name: string;
  imageUrl?: string;
  activities?: any[];
  icon?: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/category';
  readonly error = signal<string | null>(null);
  private http = inject(HttpClient);
  private router = inject(Router);

  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<Category[]>(this.baseUrl).subscribe({
      next: (data) => {
        console.log('Categories loaded: ', data);
        this.categories = data;
      },
      error: (err) => {
        console.error('Erreur API catégories', err);
        this.error.set('Erreur lors du chargement des catégories.');
      }
    });
  }

  navigateTo(categoryId: string): void {
    if (!categoryId) {
      console.error('Category ID is undefined!');
      return;
    }
    this.router.navigate([`/activity/${categoryId}`]);
  }
}
