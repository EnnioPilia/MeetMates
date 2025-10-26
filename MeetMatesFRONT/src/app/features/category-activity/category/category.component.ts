import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
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
  imports: [MatCardModule, MatIconModule, NgFor],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];

  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '') + '/category';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<Category[]>(this.baseUrl).subscribe({
      next: (data) => {
        console.log('Categories loaded: ', data);
        this.categories = data;
      },
      error: (err) => console.error('Erreur API catégories', err)
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
